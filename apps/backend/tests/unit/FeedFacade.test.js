import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/repositories/PostRepository.js", () => ({
  default: {
    findPosts: vi.fn(),
  },
}));

import FeedFacade from "../../src/facades/FeedFacade.js";
import PostRepository from "../../src/repositories/PostRepository.js";

describe("FeedFacade", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates feed listing to the strategy selected by sort", async () => {
    const posts = [{ id: 1, title: "Post" }];
    PostRepository.findPosts.mockResolvedValue(posts);

    const result = await FeedFacade.getFeed("newest", {
      where: {},
      attributesToInclude: [],
      limit: 5,
    });

    expect(PostRepository.findPosts).toHaveBeenCalled();
    expect(result).toEqual(posts);
  });

  it("uses trending strategy when sort is trending", async () => {
    PostRepository.findPosts.mockResolvedValue([]);

    await FeedFacade.getFeed("trending", {
      where: {},
      attributesToInclude: [],
      limit: 3,
    });

    const order = PostRepository.findPosts.mock.calls[0][0].order;
    expect(order[1]).toEqual(["post_date", "DESC"]);
  });
});
