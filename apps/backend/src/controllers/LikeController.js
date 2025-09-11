import PostLike from "../models/PostLike";
import sequelize from "../database/index";

class LikeController {
  async toggle(req, res) {
    const { post_id } = req.params;
    const user_id = req.userId;

    try {
      const like = await sequelize.transaction(async (t) => {
        let existingLike = await PostLike.findOne({
          where: {
            post_id,
            user_id,
          },
          transaction: t,
        });
        if (!existingLike) {
          
          existingLike = await PostLike.create(
            { post_id, user_id, is_deleted: false },
            { transaction: t }
          );
        } else {
      
          existingLike.is_deleted = !existingLike.is_deleted;
          await existingLike.save({ transaction: t });
        }

        return existingLike;
      });

      
      await delCache("posts:*");

      return res.json({ liked: !like.is_deleted });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao curtir/descurtir o post." });
    }
  }
}

export default new LikeController();