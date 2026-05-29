import FeedStrategy from "./FeedStrategy.js";

class NewestPostsStrategy extends FeedStrategy {
  async execute(repository, params) {
    return repository.findPosts({
      ...params,
      order: [
        ["post_date", "DESC"],
        ["id", "DESC"],
      ],
    });
  }
}

export default NewestPostsStrategy;