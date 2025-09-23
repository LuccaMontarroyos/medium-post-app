import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";

class AuthService {
  static async login(email, password) {

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Email not registered.");
    }

    
    const passwordValid = await user.checkPassword(password);
    if (!passwordValid) {
      throw new Error("Invalid password.");
    }

    
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

export default AuthService;