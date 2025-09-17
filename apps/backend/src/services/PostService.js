import { Op, literal } from "sequelize";
import Post from "../models/Post.js";
import User from "../models/User.js";
import sequelize from "../database/index.js";
import { getCache, setCache, delCache } from "../config/redis.js";
import { deleteImageFile } from "../utils/fileHelper.js";


class PostService {
  async listPosts({ limit = 5, cursor = null, currentUserId = null }) {
    const backendUrl = process.env.BASE_URL;

    const cacheKey = `posts:cursor-${cursor || "first"}:limit-${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const where = {
      post_date: { [Op.ne]: null, [Op.lte]: new Date() },
    };

    // Decodifica cursor
    if (cursor) {
      const decoded = Buffer.from(cursor, "base64").toString("utf8");
      const [dateStr, idStr] = decoded.split("_");
      const cursorDate = new Date(dateStr);
      const cursorId = parseInt(idStr, 10);

      if (Number.isNaN(cursorId) || isNaN(cursorDate.getTime())) {
        throw new Error("Cursor inválido");
      }

      where[Op.or] = [
        { post_date: { [Op.lt]: cursorDate } },
        { post_date: cursorDate, id: { [Op.lt]: cursorId } },
      ];
    }

    const posts = await Post.findAll({
      where,
      include: [
        { model: User, as: "users", attributes: ["id", "name", "email"] },
      ],
      attributes: {
        include: [
          [
            literal(
              `(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.is_deleted = false)`
            ),
            "totalLikes",
          ],
        ],
      },
      order: [
        ["post_date", "DESC"],
        ["id", "DESC"],
      ],
      limit,
      subQuery: false,
    });

    const formatted = posts.map((p) => {
      const data = p.toJSON();
      return {
        id: data.id,
        title: data.title,
        text: data.text,
        resume: data.resume,
        post_date: data.post_date,
        image: data.image ? `${backendUrl}${data.image}` : null,
        user: data.users,
        totalLikes: Number(data.totalLikes || 0),
        allowEdit: currentUserId === data.user_id,
        allowRemove: currentUserId === data.user_id,
      };
    });

    let nextCursor = null;
    if (posts.length > 0) {
      const last = posts[posts.length - 1];
      const rawCursor = `${last.post_date.toISOString()}_${last.id}`;
      nextCursor = Buffer.from(rawCursor).toString("base64");
    }

    const response = { posts: formatted, nextCursor };
    await setCache(cacheKey, response, 60);

    return response;
  }

  async createPost({ userId, title, text, resume, post_date, image }) {
    const post = await sequelize.transaction(async (t) => {
      const dateToUse = post_date ? new Date(post_date) : new Date();

      return Post.create(
        {
          user_id: userId,
          title,
          text,
          resume,
          post_date: dateToUse,
          image,
        },
        { transaction: t }
      );
    });

    await delCache("posts:*");
    return post;
  }

  async updatePost(postId, data) {
    const updatedPost = await sequelize.transaction(async (t) => {
      const post = await Post.findByPk(postId, { transaction: t });
      if (!post) throw new Error("Post não encontrado.");
      return post.update(data, { transaction: t });
    });

    await delCache("posts:*");
    return updatedPost;
  }

  async deletePost(postId, userId) {
    await sequelize.transaction(async (t) => {
      const post = await Post.findByPk(postId, { transaction: t });
      if (!post) throw new Error("Esse post não existe.");
      if (post.user_id !== userId){
        throw new Error("Requisição não autorizada.");
      }

      await deleteImageFile(post.image);
      await post.destroy({ transaction: t });
    });

    await delCache("posts:*");
  }
}

export default new PostService();
