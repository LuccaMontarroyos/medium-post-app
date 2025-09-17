// middlewares/optionalAuth.js
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.userId = null; // usuário não autenticado
    return next();
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  } catch (err) {
    req.userId = null; // token inválido, mas não bloqueia
  }

  return next();
}
