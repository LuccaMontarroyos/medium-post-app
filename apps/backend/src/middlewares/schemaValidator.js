export default function schemaValidator(schema) {
    return async (req, res, next) => {
        try {
            await schema.validate(req.body, {abortEarly: false});
            return next();
        } catch (error) {
            return res.status(400).json({
                erro: "Falha na validação",
                message: error.errors,
            })
        }
    }
}