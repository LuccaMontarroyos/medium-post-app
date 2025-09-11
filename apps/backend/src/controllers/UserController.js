import User from "../models/User";
import { userStoreSchema, userUpdateSchema } from "../schemas/UserSchema";

class UserController {
  async store(req, res) {
    const user = await sequelize.transaction(async (t) => {
      const userExist = await User.findOne({
        where: { email: req.body.email },
        transaction: t,
      });

      if (userExist) {
        throw new Error("Usuário já existe");
      }

      const newUser = await User.create(req.body, { transaction: t });
      return newUser;
    });

    const { id, name, email } = user;
    return res.json({ id, name, email });
  }
  catch(error) {
    console.error(error);
    const message =
      error.message === "Usuário já existe"
        ? error.message
        : "Erro ao criar usuário.";
    return res.status(400).json({ error: message });
  }

  async update(req, res) {
    try {
      const user = await sequelize.transaction(async (t) => {
        const currentUser = await User.findByPk(req.userId, { transaction: t });

        if (!currentUser) {
          throw new Error("Usuário não encontrado.");
        }

        const { email, oldPassword } = req.body;

        if (email && email !== currentUser.email) {
          const userExist = await User.findOne({
            where: { email },
            transaction: t,
          });
          if (userExist) {
            throw new Error("Usuário já existe.");
          }
        }

        if (oldPassword && !(await currentUser.checkPassword(oldPassword))) {
          throw new Error("Senha incorreta.");
        }

        const updatedUser = await currentUser.update(req.body, {
          transaction: t,
        });
        return updatedUser;
      });

      const { id, name, email } = user;
      return res.json({ id, name, email });
    } catch (error) {
      console.error(error);
      let status = 400;
      if (error.message === "Senha incorreta.") status = 401;
      return res.status(status).json({ error: error.message });
    }
  }
}

export default new UserController();
