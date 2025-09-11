import PostService from "../services/PostService";

class PostController {
  async index(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);
      const cursor = req.query.cursor || null;
      const currentUserId = req.userId || null;

      const response = await PostService.listPosts({ limit, cursor, currentUserId });
      return res.json(response);
    } catch (err) {
      console.error(err);
      const message = err.message === "Cursor inválido" ? err.message : "Erro ao listar posts";
      return res.status(400).json({ error: message });
    }
  }

  async store(req, res) {
    try {
      const post = await PostService.createPost({ userId: req.userId, ...req.body });
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar post" });
    }
  }

  async update(req, res) {
    try {
      const { post_id } = req.params;
      const updatedPost = await PostService.updatePost(post_id, req.body);
      return res.json(updatedPost);
    } catch (error) {
      const status = error.message === "Post não encontrado." ? 400 : 500;
      return res.status(status).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const { post_id } = req.params;
      await PostService.deletePost(post_id, req.userId);
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
