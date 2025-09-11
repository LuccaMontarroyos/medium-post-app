import PostLike from "../models/PostLike";

class LikeController {
  async toggle(req, res) {
    const { post_id } = req.params;
    const user_id = req.userId;

    try {
      let like = await PostLike.findOne({
        where: {
          post_id,
          user_id,
        },
      });

      if (!like) {
        like = await PostLike.create({ post_id, user_id, is_deleted: false });
      } else {
        like.is_deleted = !(like.is_deleted);
        await like.save();
      }

      return res.json({ liked: !(like.is_deleted)})
    } catch (error) {
        return res.status(500).json({ error: "Erro ao curtir/descurtir o post."})
    }
  }
}
