class PostSerializer {

    serialize(post, currentUserId, backendUrl) {
      const data = post.toJSON();
  
      return {
        id: data.id,
        title: data.title,
        text: data.text,
        resume: data.resume,
        post_date: data.post_date,
        image: data.image ? `${backendUrl}${data.image}` : null,
        user: data.users,
        totalLikes: Number(data.totalLikes || 0),
        allowEdit: currentUserId === data.user_id,
        allowRemove: currentUserId === data.user_id,
        isLikedByUser: data.isLikedByUser || false,
      };
    }
  
    serializeMany(posts, currentUserId, backendUrl) {
      return posts.map((post) =>
        this.serialize(post, currentUserId, backendUrl)
      );
    }
  }
  
  export default new PostSerializer();