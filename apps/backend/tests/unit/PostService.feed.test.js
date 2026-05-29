/**
 * Testes da funcionalidade de feed ordenável (Strategy + Facade + cache).
 * Escritos para validar o comportamento introduzido na evolução do projeto (TDD).
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/redis.js", () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
  delCache: vi.fn(),
}));

vi.mock("../../src/facades/FeedFacade.js", () => ({
  default: {
    getFeed: vi.fn(),
  },
}));

vi.mock("../../src/serializers/PostSerializer.js", () => ({
  default: {
    serializeMany: vi.fn((posts) =>
      posts.map((p) => ({ id: p.id, title: p.title || "serialized" })),
    ),
  },
}));

vi.mock("../../src/metrics/MetricsService.js", () => ({
  default: {
    incrementCacheHit: vi.fn(),
    incrementCacheMiss: vi.fn(),
  },
}));

import { getCache, setCache } from "../../src/config/redis.js";
import FeedFacade from "../../src/facades/FeedFacade.js";
import MetricsService from "../../src/metrics/MetricsService.js";
import PostService from "../../src/services/PostService.js";

describe("PostService.listPosts — feed com cache e ordenação", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BASE_URL = "http://localhost:3333";
  });

  it("retorna resposta em cache e registra cache hit", async () => {
    const cached = { posts: [{ id: 1 }], nextCursor: null };
    getCache.mockResolvedValue(cached);

    const result = await PostService.listPosts({ sort: "newest" });

    expect(result).toEqual(cached);
    expect(MetricsService.incrementCacheHit).toHaveBeenCalledOnce();
    expect(FeedFacade.getFeed).not.toHaveBeenCalled();
  });

  it("em cache miss busca feed via Facade/Strategy e persiste no Redis", async () => {
    getCache.mockResolvedValue(null);
    const postDate = new Date("2025-05-10T10:00:00.000Z");
    FeedFacade.getFeed.mockResolvedValue([{ id: 42, post_date: postDate }]);

    const result = await PostService.listPosts({
      sort: "trending",
      limit: 5,
      search: "node",
    });

    expect(MetricsService.incrementCacheMiss).toHaveBeenCalledOnce();
    expect(FeedFacade.getFeed).toHaveBeenCalledWith(
      "trending",
      expect.objectContaining({ limit: 5 }),
    );
    expect(setCache).toHaveBeenCalledWith(
      expect.stringContaining("posts:trending"),
      expect.objectContaining({ posts: expect.any(Array) }),
      60,
    );
    expect(result.posts).toHaveLength(1);
    expect(result.nextCursor).toBeTruthy();
  });

  it("rejeita cursor inválido", async () => {
    getCache.mockResolvedValue(null);
    const badCursor = Buffer.from("not-a-date_abc").toString("base64");

    await expect(
      PostService.listPosts({ cursor: badCursor }),
    ).rejects.toThrow("Invalid cursor");
  });
});
