import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/database/index.js", () => ({
  default: {
    transaction: vi.fn((callback) => callback("mock-transaction")),
  },
}));

vi.mock("../../src/config/redis.js", () => ({
  delCache: vi.fn(),
}));

vi.mock("../../src/repositories/LikeRepository.js", () => ({
  default: {
    findPostLike: vi.fn(),
    create: vi.fn(),
  },
}));

import LikeService from "../../src/services/LikeService.js";
import LikeRepository from "../../src/repositories/LikeRepository.js";
import { delCache } from "../../src/config/redis.js";

describe("LikeService.toggleLike", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a like when none exists", async () => {
    const created = { is_deleted: false };
    LikeRepository.findPostLike.mockResolvedValue(null);
    LikeRepository.create.mockResolvedValue(created);

    const result = await LikeService.toggleLike({ post_id: 1, user_id: 2 });

    expect(LikeRepository.create).toHaveBeenCalledWith(
      { post_id: 1, user_id: 2, is_deleted: false },
      "mock-transaction",
    );
    expect(result).toEqual({ liked: true });
    expect(delCache).toHaveBeenCalledWith("posts:*");
  });

  it("toggles is_deleted when like already exists", async () => {
    const existing = {
      is_deleted: false,
      save: vi.fn().mockResolvedValue(undefined),
    };
    LikeRepository.findPostLike.mockResolvedValue(existing);

    const result = await LikeService.toggleLike({ post_id: 5, user_id: 9 });

    expect(existing.is_deleted).toBe(true);
    expect(existing.save).toHaveBeenCalledWith({ transaction: "mock-transaction" });
    expect(result).toEqual({ liked: false });
  });
});
