import UserService from "../services/UserService.js";

class UserController {
  async store(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      const { id, name, email } = user;
      return res.json({ id, name, email });
    } catch (error) {
      switch (error.message) {
        case "Email already registered.":
          return res.status(409).json({ error: "A user with this email already exists." });
        default:
          return res.status(500).json({ error: "Failed to create user." });
      }
    }
  }

  async update(req, res) {  
    try {
      const user = await UserService.updateUser(req.userId, req.body);
      const { id, name, email } = user;
      return res.json({ id, name, email });
    } catch (error) {
      console.error(error);
      switch (error.message) {
        case "User not found.":
          return res.status(404).json({ error: "User not found." });
        case "Email already registered.":
          return res.status(409).json({ error: "A user with this email already exists." });
        case "Incorrect password.":
          return res.status(403).json({ error: "Incorrect password." });
        default:
          return res.status(500).json({ error: "Failed to update user." });
      }
    }
  }
}

export default new UserController();
