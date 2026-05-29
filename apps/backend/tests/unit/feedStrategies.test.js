import { describe, it, expect, vi } from "vitest";
import NewestPostsStrategy from "../../src/strategies/feed/NewestPostsStrategy.js";
import MostLikedPostsStrategy from "../../src/strategies/feed/MostLikedPostsStrategy.js";
import TrendingPostsStrategy from "../../src/strategies/feed/TrendingPostsStrategy.js";
import FeedStrategy from "../../src/strategies/feed/FeedStrategy.js";

describe("Feed strategies", () => {
  const baseParams = {
    where: { active: true },
    attributesToInclude: [],
    limit: 10,
  };

  it("base FeedStrategy throws when execute is not implemented", async () => {
    const strategy = new FeedStrategy();
    await expect(strategy.execute({}, baseParams)).rejects.toThrow(
      "Method not implemented.",
    );
  });

  it("NewestPostsStrategy orders by post_date and id desc", async () => {
    const repository = { findPosts: vi.fn().mockResolvedValue([]) };
    const strategy = new NewestPostsStrategy();

    await strategy.execute(repository, baseParams);

    expect(repository.findPosts).toHaveBeenCalledWith({
      ...baseParams,
      order: [
        ["post_date", "DESC"],
        ["id", "DESC"],
      ],
    });
  });

  it("MostLikedPostsStrategy orders by totalLikes desc", async () => {
    const repository = { findPosts: vi.fn().mockResolvedValue([]) };
    const strategy = new MostLikedPostsStrategy();

    await strategy.execute(repository, baseParams);

    const call = repository.findPosts.mock.calls[0][0];
    expect(call.order).toHaveLength(1);
    expect(call.order[0][1]).toBe("DESC");
  });

  it("TrendingPostsStrategy orders by likes then post_date", async () => {
    const repository = { findPosts: vi.fn().mockResolvedValue([]) };
    const strategy = new TrendingPostsStrategy();

    await strategy.execute(repository, baseParams);

    const call = repository.findPosts.mock.calls[0][0];
    expect(call.order).toHaveLength(2);
    expect(call.order[1]).toEqual(["post_date", "DESC"]);
  });
});
