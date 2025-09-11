import sequelize from "../config/database";
import PostLike from "../models/PostLike";
import { delCache } from "../config/redis";

class LikeService {
  async toggleLike({ post_id, user_id }) {
    const like = await sequelize.transaction(async (t) => {
      let existingLike = await PostLike.findOne({
        where: { post_id, user_id },
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
    return { liked: !like.is_deleted };
  }
}

export default new LikeService();
