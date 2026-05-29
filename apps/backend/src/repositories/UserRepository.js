import User from "../models/User.js";

class UserRepository {
  async findByEmail(email, transaction = null) {
    return await User.findOne({
      where: { email },
      transaction,
    });
  }

  async findById(userId, transaction = null) {
    return await User.findByPk(userId, {
      transaction,
    });
  }

  async create(data, transaction = null) {
    return await User.create(data, {
      transaction,
    });
  }
}

export default new UserRepository();