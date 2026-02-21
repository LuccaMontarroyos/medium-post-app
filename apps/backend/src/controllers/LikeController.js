import LikeService from "../services/LikeService.js";

class LikeController {
	async toggle(req, res) {
		const { post_id } = req.params;
		const user_id = req.userId;

		try {
			const result = await LikeService.toggleLike({ post_id, user_id });
			return res.json(result);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao curtir/descurtir o post." });
		}
	}
}

export default new LikeController();
