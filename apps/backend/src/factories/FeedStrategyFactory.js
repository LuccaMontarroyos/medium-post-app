import NewestPostsStrategy from "../strategies/feed/NewestPostsStrategy.js";
import MostLikedPostsStrategy from "../strategies/feed/MostLikedPostsStrategy.js";
import TrendingPostsStrategy from "../strategies/feed/TrendingPostsStrategy.js";

class FeedStrategyFactory {
  create(type) {
    switch (type) {
      case "most_liked":
        return new MostLikedPostsStrategy();

      case "trending":
        return new TrendingPostsStrategy();

      case "newest":
      default:
        return new NewestPostsStrategy();
    }
  }
}

export default new FeedStrategyFactory();