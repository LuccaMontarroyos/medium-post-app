import { literal } from "sequelize";
import FeedStrategy from "./FeedStrategy.js";

class TrendingPostsStrategy extends FeedStrategy {
  async execute(repository, params) {
    return repository.findPosts({
      ...params,
      order: [
        [literal('"totalLikes"'), "DESC"],
        ["post_date", "DESC"],
      ],
    });
  }
}

export default TrendingPostsStrategy;