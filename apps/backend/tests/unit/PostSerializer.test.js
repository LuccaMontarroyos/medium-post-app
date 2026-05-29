import { describe, it, expect } from "vitest";
import PostSerializer from "../../src/serializers/PostSerializer.js";
import { createMockPost } from "../helpers/mockPost.js";

describe("PostSerializer", () => {
  const backendUrl = "http://localhost:3333";

  it("serializes post with image URL and permissions for owner", () => {
    const post = createMockPost({ user_id: 7, totalLikes: "12" });

    const result = PostSerializer.serialize(post, 7, backendUrl);

    expect(result.id).toBe(1);
    expect(result.image).toBe(`${backendUrl}/uploads/posts/test.png`);
    expect(result.totalLikes).toBe(12);
    expect(result.allowEdit).toBe(true);
    expect(result.allowRemove).toBe(true);
    expect(result.isLikedByUser).toBe(false);
    expect(result.user).toEqual(post.toJSON().users);
  });

  it("denies edit/remove for non-owner", () => {
    const post = createMockPost({ user_id: 1 });

    const result = PostSerializer.serialize(post, 99, backendUrl);

    expect(result.allowEdit).toBe(false);
    expect(result.allowRemove).toBe(false);
  });

  it("serializeMany maps all posts", () => {
    const posts = [createMockPost({ id: 1 }), createMockPost({ id: 2 })];

    const result = PostSerializer.serializeMany(posts, null, backendUrl);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });
});
