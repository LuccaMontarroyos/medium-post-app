import { Op, literal } from "sequelize";
import Post from "../models/Post";

class PostController {
  async index(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);
      const cursor = req.query.cursor || null;
      const currentUserId = req.userId || null;

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
            [literal(`SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = "Post"."id" AND pl.is_deleted = false`), "totalLikes"],
          ],
        },
        order: [["post_date", "DESC"], ["id", "DESC"]],
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

      return res.json({
        posts: formatted,
        nextCursor,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar posts" });
    }
  }

  async store(req, res) {

    const { title, text, resume, schedule_date } = req.body;

    const post = await Post.create({
      user_id: req.userId,
      title,
      text,
      resume,
      post_date: schedule_date ? schedule_date : new Date(),
    });

    return res.json(post);
  }

  async update(req, res) {
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);

    if (!post) {
      return res.status(400).json({ error: "Post não encontrado." });
    }

    await post.update(req.body);


    return res.send();
  }

  async destroy(req, res) {
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);

    if (!post) {
      return res.status(400).json({ error: "Esse post não existe." });
    }

    if (post.user_id !== req.userId) {
      return res.status(403).json({ error: "Requisição não autorizada." });
    }

    await post.destroy();

    return res.send();
  }
}

export default new PostController();
