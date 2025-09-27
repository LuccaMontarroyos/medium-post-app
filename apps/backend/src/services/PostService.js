import { Op, literal, where as sequelizeWhere, fn as sequelizeFn, col as sequelizeCol, } from "sequelize";
import Post from "../models/Post.js";
import User from "../models/User.js";
import sequelize from "../database/index.js";
import { getCache, setCache, delCache } from "../config/redis.js";
import { deleteImageFile } from "../utils/fileHelper.js";

class PostService {
  async listPosts({
    limit = 5,
    cursor = null,
    currentUserId = null,
    search = null,
  }) {
    const backendUrl = process.env.BASE_URL;

    const searchForCache = search ? search.replace(/\s+/g, "_") : "all";
    const cacheKey = `posts:search-${searchForCache}:cursor-${
      cursor || "first"
    }:limit-${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const where = {
      post_date: { 
        [Op.ne]: null, 
        [Op.lte]: new Date() 
      },
    };

    if (search) {
      const searchTermLower = search.toLowerCase();

      where[Op.and] = [
        {
          [Op.or]: [
            sequelizeWhere(sequelizeFn("LOWER", sequelizeCol("title")), {
              [Op.like]: `%${searchTermLower}%`,
            }),
            sequelizeWhere(sequelizeFn("LOWER", sequelizeCol("text")), {
              [Op.like]: `%${searchTermLower}%`,
            }),
            sequelizeWhere(sequelizeFn("LOWER", sequelizeCol("resume")), {
              [Op.like]: `%${searchTermLower}%`,
            }),
          ],
        },
      ];
    }

    
    if (cursor) {
      const decoded = Buffer.from(cursor, "base64").toString("utf8");
      const [dateStr, idStr] = decoded.split("_");
      const cursorDate = new Date(dateStr);
      const cursorId = parseInt(idStr, 10);

      if (Number.isNaN(cursorId) || isNaN(cursorDate.getTime())) {
        throw new Error("Invalid cursor");
      }

      where[Op.or] = [
        { post_date: { [Op.lt]: cursorDate } },
        { post_date: cursorDate, id: { [Op.lt]: cursorId } },
      ];
    }

    const attributesToInclude = [
      [
        literal(
          `(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.is_deleted = false)`
        ),
        "totalLikes",
      ],
    ];

    if (currentUserId) {
      attributesToInclude.push([
        literal(
          `(SELECT EXISTS (SELECT 1 FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.user_id = ${currentUserId} AND pl.is_deleted = false))`
        ),
        "isLikedByUser",
      ]);
    }

    const posts = await Post.findAll({
      where,
      include: [
        { model: User, as: "users", attributes: ["id", "name", "email"] },
      ],
      attributes: {
        include: attributesToInclude,
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
        isLikedByUser: data.isLikedByUser || false,
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

  async getPostById(postId, currentUserId) {
    const backendUrl = process.env.BASE_URL;

    const attributesToInclude = [
      [
        sequelize.literal(`(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.is_deleted = false)`),
        "totalLikes",
      ],
    ];

    if (currentUserId) {
      attributesToInclude.push([
        sequelize.literal(`(SELECT EXISTS (SELECT 1 FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.user_id = ${currentUserId} AND pl.is_deleted = false))`),
        "isLikedByUser",
      ]);
    }

    const post = await Post.findByPk(postId, {
      include: [{ model: User, as: "users", attributes: ["id", "name", "email"] }],
      attributes: {
        include: attributesToInclude,
      },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    const data = post.toJSON();
    return {
      id: data.id,
      title: data.title,
      text: data.text,
      resume: data.resume,
      post_date: data.post_date,
      image: data.image ? `${backendUrl}${data.image}` : null,
      user: data.users,
      totalLikes: Number(data.totalLikes || 0),
      isLikedByUser: data.isLikedByUser || false,
      allowEdit: currentUserId === data.user_id,
      allowRemove: currentUserId === data.user_id,
    };
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
      if (!post) throw new Error("Post not found.");
      return post.update(data, { transaction: t });
    });

    await delCache("posts:*");
    return updatedPost;
  }

  async deletePost(postId, userId) {
    await sequelize.transaction(async (t) => {
      const post = await Post.findByPk(postId, { transaction: t });
      if (!post) throw new Error("This post doesn´t exists.");
      if (post.user_id !== userId) {
        throw new Error("Requisition not authorized.");
      }

      await post.destroy({ transaction: t });
      await deleteImageFile(post.image);
    });

    await delCache("posts:*");
  }
}

export default new PostService();
