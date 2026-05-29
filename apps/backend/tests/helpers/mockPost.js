export function createMockPost(overrides = {}) {
  const defaults = {
    id: 1,
    title: "Título",
    text: "Texto completo",
    resume: "Resumo",
    post_date: new Date("2025-05-01T12:00:00.000Z"),
    image: "/uploads/posts/test.png",
    user_id: 10,
    users: { id: 10, name: "Autor", email: "autor@test.com" },
    totalLikes: 5,
    isLikedByUser: false,
  };

  const data = { ...defaults, ...overrides };

  return {
    ...data,
    toJSON: () => ({ ...data }),
  };
}
