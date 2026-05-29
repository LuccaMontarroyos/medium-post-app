import sequelize from "../database/index.js";
import UserRepository from "../repositories/UserRepository.js";

class UserService {
  async createUser(data) {
    return sequelize.transaction(async (t) => {
      const userExist = await UserRepository.findByEmail(data.email);

      if (userExist) {
        throw new Error("Email already registered.");
      }

      return await UserRepository.create(data, t);
    });
  }

  async updateUser(userId, data) {
    return sequelize.transaction(async (t) => {
      const currentUser = await UserRepository.findById(userId, t);

      if (!currentUser) {
        throw new Error("User not found.");
      }

      const { email, oldPassword } = data;

      if (email && email !== currentUser.email) {
        const userExist = await UserRepository.findByEmail(email);

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
