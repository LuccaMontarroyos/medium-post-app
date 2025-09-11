import { Op, literal } from "sequelize";
import Post from "../models/Post";
import { getCache, setCache, delCache } from "../config/redis";
import sequelize from "../config/database";

class PostController {
  async index(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);
      const cursor = req.query.cursor || null;
      const currentUserId = req.userId || null;
      const cacheKey = `posts:cursor-${cursor || "first"}:limit-${limit}`;

      const cached = await getCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Base do where (somente posts publicados)
      const where = {
        post_date: { [Op.ne]: null, [Op.lte]: new Date() },
      };

      // Decodifica cursor se existir
      if (cursor) {
        try {
          const decoded = Buffer.from(cursor, "base64").toString("utf8");
          const [dateStr, idStr] = decoded.split("_");
          const cursorDate = new Date(dateStr);
          const cursorId = parseInt(idStr, 10);

          if (Number.isNaN(cursorId) || isNaN(cursorDate.getTime())) {
            throw new Error();
          }

          where[Op.or] = [
            { post_date: { [Op.lt]: cursorDate } },
            { post_date: cursorDate, id: { [Op.lt]: cursorId } },
          ];
        } catch {
          return res.status(400).json({ error: "Cursor inválido" });
        }
      }

      // Query principal
      const posts = await Post.findAll({
        where,
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"], // Info do autor
          },
        ],
        attributes: {
          include: [
            [
              literal(
                `SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.is_deleted = false`
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

      // Formata e adiciona flags
      const formatted = posts.map((p) => {
        const data = p.toJSON();
        return {
          id: data.id,
          title: data.title,
          text: data.text,
          resume: data.resume,
          post_date: data.post_date,
          user: data.User,
          totalLikes: Number(data.totalLikes || 0),
          allowEdit: currentUserId === data.user_id,
          allowRemove: currentUserId === data.user_id,
        };
      });

      // Calcula próximo cursor
      let nextCursor = null;
      if (posts.length > 0) {
        const last = posts[posts.length - 1];
        const rawCursor = `${last.post_date.toISOString()}_${last.id}`;
        nextCursor = Buffer.from(rawCursor).toString("base64");
      }

      const response = { posts: formatted, nextCursor };

      await setCache(cacheKey, response, 60);

      return res.json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar posts" });
    }
  }

  async store(req, res) {
    try {
      const post = await sequelize.transaction(async (t) => {
        const { title, text, resume, schedule_date } = req.body;

        const createdPost = await Post.create(
          {
            user_id: req.userId,
            title,
            text,
            resume,
            post_date: schedule_date ? schedule_date : new Date(),
          },
          { transaction: t }
        );
        return createdPost;
      });

      await delCache("posts:*");

      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar post" });
    }
  }

  async update(req, res) {
    try {
      const updatedPost = await sequelize.transaction(async (t) => {
        const { post_id } = req.params;
        const post = await Post.findByPk(post_id);

        if (!post) {
          throw new Error("Post não encontrado.");
        }

        return await post.update(req.body, { transaction: t });
      });

      await delCache("posts:*");

      return res.json(updatedPost);
    } catch (error) {
      const status = error.message === "Post não encontrado." ? 400 : 500;
      return res.status(status).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const { post_id } = req.params;

        const post = await Post.findByPk(post_id, { transaction: t });

        if (!post) {
          throw new Error("Esse post não existe.");
        }

        if (post.user_id !== req.userId) {
          throw new Error("Requisição não autorizada.");
        }

        await post.destroy({ transaction: t });
      });

      await delCache("posts:*");

      return res.send();
    } catch (error) {
      let status = 500;
      if (error.message === "Esse post não existe.") status = 400;
      if (error.message === "Requisição não autorizada.") status = 403;

      return res.status(status).json({ error: error.message });
    }
  }
}

export default new PostController();
