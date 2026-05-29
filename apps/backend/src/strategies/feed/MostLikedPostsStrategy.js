import { literal } from "sequelize";
import FeedStrategy from "./FeedStrategy.js";

class MostLikedPostsStrategy extends FeedStrategy {
  async execute(repository, params) {
    return repository.findPosts({
      ...params,
      order: [[literal('"totalLikes"'), "DESC"]],
    });
  }
}

export default MostLikedPostsStrategy;