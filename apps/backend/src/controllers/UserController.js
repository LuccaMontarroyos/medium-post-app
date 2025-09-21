import UserService from "../services/UserService.js";

class UserController {
  async store(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      const { id, name, email } = user;
      return res.json({ id, name, email });
    } catch (error) {
      console.error(error);
      const message =
        error.message === "Usuário já existe"
          ? error.message
          : "Erro ao criar usuário.";
      return res.status(400).json({ error: message });
    }
  }

  async update(req, res) {  
    try {
      const user = await UserService.updateUser(req.userId, req.body);
      const { id, name, email } = user;
      return res.json({ id, name, email });
    } catch (error) {
      console.error(error);

      let status = 400;
      if (error.message === "Senha incorreta.") status = 403;

      return res.status(status).json({ error: error.message });
    }
  }
}

export default new UserController();
