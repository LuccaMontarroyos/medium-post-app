import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/redis.js", () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
  delCache: vi.fn(),
}));

vi.mock("../../src/repositories/PostRepository.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

vi.mock("../../src/serializers/PostSerializer.js", () => ({
  default: {
    serialize: vi.fn((post) => ({ id: post.id, serialized: true })),
  },
}));

import PostRepository from "../../src/repositories/PostRepository.js";
import PostSerializer from "../../src/serializers/PostSerializer.js";
import PostService from "../../src/services/PostService.js";
import { createMockPost } from "../helpers/mockPost.js";

describe("PostService.getPostById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BASE_URL = "http://localhost:3333";
  });

  it("returns serialized post when found", async () => {
    const post = createMockPost({ id: 99 });
    PostRepository.findById.mockResolvedValue(post);

    const result = await PostService.getPostById(99, 10);

    expect(PostRepository.findById).toHaveBeenCalledWith(
      99,
      expect.any(Array),
    );
    expect(PostSerializer.serialize).toHaveBeenCalledWith(
      post,
      10,
      "http://localhost:3333",
    );
    expect(result).toEqual({ id: 99, serialized: true });
  });

  it("throws when post is not found", async () => {
    PostRepository.findById.mockResolvedValue(null);

    await expect(PostService.getPostById(404, null)).rejects.toThrow(
      "Post not found.",
    );
  });
});
