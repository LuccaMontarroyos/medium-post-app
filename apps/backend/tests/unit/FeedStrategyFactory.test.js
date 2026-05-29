import { describe, it, expect } from "vitest";
import FeedStrategyFactory from "../../src/factories/FeedStrategyFactory.js";
import NewestPostsStrategy from "../../src/strategies/feed/NewestPostsStrategy.js";
import MostLikedPostsStrategy from "../../src/strategies/feed/MostLikedPostsStrategy.js";
import TrendingPostsStrategy from "../../src/strategies/feed/TrendingPostsStrategy.js";

describe("FeedStrategyFactory", () => {
  it("creates NewestPostsStrategy for newest sort", () => {
    const strategy = FeedStrategyFactory.create("newest");
    expect(strategy).toBeInstanceOf(NewestPostsStrategy);
  });

  it("creates NewestPostsStrategy as default", () => {
    const strategy = FeedStrategyFactory.create("unknown");
    expect(strategy).toBeInstanceOf(NewestPostsStrategy);
  });

  it("creates MostLikedPostsStrategy for most_liked sort", () => {
    const strategy = FeedStrategyFactory.create("most_liked");
    expect(strategy).toBeInstanceOf(MostLikedPostsStrategy);
  });

  it("creates TrendingPostsStrategy for trending sort", () => {
    const strategy = FeedStrategyFactory.create("trending");
    expect(strategy).toBeInstanceOf(TrendingPostsStrategy);
  });
});
