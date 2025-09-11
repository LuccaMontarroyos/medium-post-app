import User from "../models/User";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

class AuthService {
  static async login(email, password) {
    // Busca usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Usuário não existe.");
    }

    // Verifica senha
    const passwordValid = await user.checkPassword(password);
    if (!passwordValid) {
      throw new Error("Senha inválida.");
    }

    // Gera token JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
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