import FeedStrategyFactory from "../factories/FeedStrategyFactory.js";
import PostRepository from "../repositories/PostRepository.js";

class FeedFacade {

  async getFeed(sort, params) {

    const strategy = FeedStrategyFactory.create(sort);

    return strategy.execute(
      PostRepository,
      params
    );
  }
}

export default new FeedFacade();