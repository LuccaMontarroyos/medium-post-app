import sequelize from "../database/index.js";
import { delCache } from "../config/redis.js";
import LikeRepository from "../repositories/LikeRepository.js";

class LikeService {
  async toggleLike({ post_id, user_id }) {
    const like = await sequelize.transaction(async (t) => {
  
      let existingLike = await LikeRepository.findPostLike(post_id, user_id, t);

      if (!existingLike) {
        existingLike = await LikeRepository.create(
          { 
            post_id, 
            user_id, 
            is_deleted: false 
          },
          t
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
