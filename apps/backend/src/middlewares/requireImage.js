export default function requireImage(req, res, next) {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        type_error: "VALIDATION_ERROR",
        message: "A imagem do post é obrigatória.",
      });
    }
    next();
}