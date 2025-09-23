import User from "../models/User.js";
import sequelize from "../database/index.js";

class UserService {
  async createUser(data) {
    return sequelize.transaction(async (t) => {
      const userExist = await User.findOne({
        where: { email: data.email },
        transaction: t,
      });

      if (userExist) {
        throw new Error("Email already registered.");
      }

      return await User.create(data, { transaction: t });
    });
  }

  async updateUser(userId, data) {
    return sequelize.transaction(async (t) => {
      const currentUser = await User.findByPk(userId, { transaction: t });

      if (!currentUser) {
        throw new Error("User not found.");
      }

      const { email, oldPassword } = data;

      if (email && email !== currentUser.email) {
        const userExist = await User.findOne({
          where: { email },
          transaction: t,
        });

        if (userExist) {
          throw new Error("Email already registered.");
        }
      }

      if (oldPassword && !(await currentUser.checkPassword(oldPassword))) {
        throw new Error("Incorrect password.");
      }

      return await currentUser.update(data, { transaction: t });
    });
  }
}

export default new UserService();