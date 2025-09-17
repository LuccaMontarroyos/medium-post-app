import ErrorMessages from "../utils/ErrorMessages.js";
import pickBy from "lodash";

export default class SchemaValidator {
  static getMessage(error) {
    return ErrorMessages[error.type]
      ? ErrorMessages[error.type](error.path, error.params?.min || "")
      : error.message || "Houve um erro, tente novamente em breve.";
  }

  static async isValid(schema, req) {
    try {
      const data = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      const filter = req.query; // se quiser validar query params também
      return { error: null, results: { data, filter } };
    } catch (err) {
      const error = err.inner?.[0] || err;
      return { error, results: {} };
    }
  }

  static validate(schema) {
    return async (req, res, next) => {
      try {
        // validação do Yup
        const results = await schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

        // remove undefined
        req.data = pickBy(results, (value) => value !== undefined);

        return next();
      } catch (err) {
        if (err.name === "ValidationError") {
          return res.status(400).json({
            status: "error",
            type_error: "VALIDATION_ERROR",
            // pega apenas a primeira mensagem de erro
            message:
              err.errors[0] || "Houve um erro, tente novamente em breve.",
          });
        }

        return next(err);
      }
    };
  }
}
