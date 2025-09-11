import User from "../models/User";
import sequelize from "../config/database";

class UserService {
  async createUser(data) {
    return sequelize.transaction(async (t) => {
      const userExist = await User.findOne({
        where: { email: data.email },
        transaction: t,
      });

      if (userExist) {
        throw new Error("Usuário já existe");
      }

      return await User.create(data, { transaction: t });
    });
  }

  async updateUser(userId, data) {
    return sequelize.transaction(async (t) => {
      const currentUser = await User.findByPk(userId, { transaction: t });

      if (!currentUser) {
        throw new Error("Usuário não encontrado.");
      }

      const { email, oldPassword } = data;

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

      return await currentUser.update(data, { transaction: t });
    });
  }
}

export default new UserService();