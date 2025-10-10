import AuthService from "../services/AuthService.js";

class SessionController {
	async store(req, res) {
		const { email, password } = req.body;

		try {
			const result = await AuthService.login(email, password);
			return res.json(result);
		} catch (error) {

			const status =
				error.message === "Email not registered." || error.message === "Invalid password."
					? 403
					: 500;
			return res.status(status).json({ error: error.message });
		}
	}
}

export default new SessionController();
