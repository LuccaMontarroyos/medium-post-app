import PostLike from "../models/PostLike.js";

class LikeRepository {
  async findPostLike(post_id, user_id, transaction = null) {
    return await PostLike.findOne({
      where: {
        post_id: post_id,
        user_id: user_id,
      },
      transaction,
    });
  }

  async create(data, transaction = null) {
    return await PostLike.create(data, {
      transaction,
    });
  }
}

export default new LikeRepository();