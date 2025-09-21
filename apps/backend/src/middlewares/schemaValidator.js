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
      const filter = req.query;
      return { error: null, results: { data, filter } };
    } catch (err) {
      const error = err.inner?.[0] || err;
      return { error, results: {} };
    }
  }

  static validate(schema) {
    return async (req, res, next) => {
      try {
        
        const results = await schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

        
        req.data = pickBy(results, (value) => value !== undefined);

        return next();
      } catch (err) {
        if (err.name === "ValidationError") {
          return res.status(400).json({
            status: "error",
            type_error: "VALIDATION_ERROR",
        
            message:
              err.errors[0] || "Houve um erro, tente novamente em breve.",
          });
        }

        return next(err);
      }
    };
  }
}
