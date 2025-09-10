import Post from "../models/Post";

class PostController {
  async index(req, res) {

  }

  async store(req, res) {
    if (!(await postSchema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação." });
    }

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
  }

  async destroy(req, res) {
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);

    if (!post) {
      return res.status(400).json({ error: "Esse post não existe." });
    }

    if (user_id !== req.userId) {
      return res.status(403).json({ error: "Requisição não autorizada." });
    }

    await post.destroy();

    return res.send();
  }
}

export default new PostController();
