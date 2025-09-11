import AuthService from "../services/AuthService";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    try {
      const result = await AuthService.login(email, password);
      return res.json(result);
    } catch (error) {
      // Define status 401 para erros de autenticação
      const status =
        error.message === "Usuário não existe." || error.message === "Senha inválida."
          ? 401
          : 500;
      return res.status(status).json({ error: error.message });
    }
  }
}

export default new SessionController();
