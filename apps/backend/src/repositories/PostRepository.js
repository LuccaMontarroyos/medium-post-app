import Post from "../models/Post.js";
import User from "../models/User.js";

class PostRepository {

  async findPosts({
    where,
    attributesToInclude,
    limit,
    order,
  }) {
    return Post.findAll({
      where,
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: {
        include: attributesToInclude,
      },
      order,
      limit,
      subQuery: false,
    });
  }

  async findById(postId, attributesToInclude) {
    return Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: {
        include: attributesToInclude,
      },
    });
  }

  async findByPk(postId, transaction = null) {
    return Post.findByPk(postId, {
      transaction,
    });
  }

  async create(data, transaction = null) {
    return Post.create(data, {
      transaction,
    });
  }
}

export default new PostRepository();