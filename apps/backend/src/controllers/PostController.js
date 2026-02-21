import PostService from "../services/PostService.js";

class PostController {
	async index(req, res) {
		try {
			const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);
			const cursor = req.query.cursor || null;
			const currentUserId = req.userId || null;
			const search = req.query.search || null;

			const response = await PostService.listPosts({
				limit,
				cursor,
				currentUserId,
				search,
			});
			return res.json(response);
		} catch (err) {
			console.error(err);
			const message =
				err.message === "Invalid cursor" ? err.message : "Error listing posts";
			return res.status(400).json({ error: message });
		}
	}

	async show(req, res) {
		try {
			const { post_id } = req.params;
			const currentUserId = req.userId || null;

			const post = await PostService.getPostById(post_id, currentUserId);
			return res.json(post);
		} catch (error) {
			if (error.message == "Post not found.") {
				return res.status(404).json({ error: "Post not found." });
			}
			return res.status(500).json({ error: "Failed to retrieve post." })
		}
	}

	async store(req, res) {
		try {
			const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : null;
			const postData = { userId: req.userId, ...req.body, image: imagePath };
			const post = await PostService.createPost(postData);
			return res.json(post);
		} catch (error) {
			return res.status(500).json({ error: "Failed to create post" });
		}
	}

	async update(req, res) {
		try {
			const { post_id } = req.params;
			const updatedPost = await PostService.updatePost(post_id, req.body);
			return res.json(updatedPost);
		} catch (error) {
			switch (error.message) {
				case "Post not found.":
					return res.status(404).json({ error: "Post not found." });
				case "User is not the owner of the post.":
					return res
						.status(403)
						.json({ error: "User is not the owner of the post." });
				default:
					return res.status(500).json({ error: "Failed to update post." });
			}
		}
	}

	async destroy(req, res) {
		try {
			const { post_id } = req.params;
			await PostService.deletePost(post_id, req.userId);
			return res.send();
		} catch (error) {
			switch (error.message) {
				case "Post not found.":
					return res.status(404).json({ error: "Post not found." });
				case "User is not the owner of the post.":
					return res
						.status(403)
						.json({ error: "User is not the owner of the post." });
				default:
					return res.status(500).json({ error: "Failed to delete post." });
			}
		}
	}
}

export default new PostController();
