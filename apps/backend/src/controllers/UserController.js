import User from "../models/User";
import { userStoreSchema, userUpdateSchema } from "../schemas/UserSchema";

class UserController {
  async store() {
    if (!(await userStoreSchema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação." });
    }

    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExist) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update() {
    if (!(await userUpdateSchema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação." });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = await User.findOne({
        where: {
          email,
        },
      });

      if (userExist) {
        return res.status(400).json({ error: "Usuário já existe." });
      }
    }
  }
}
