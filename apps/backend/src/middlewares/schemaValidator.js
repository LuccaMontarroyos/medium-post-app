export default class SchemaValidator{
    static getMessage(error) {
		const field = error.params.label || error.params.path;

		return ErrorMessages[error.type]
			? ErrorMessages[error.type](field, error.params.originalValue, error.params.type)
			: 'Houve um erro, tente novamente em breve.';
	}

    static validate(schema) {
        return async (req, res, next) => {
            const {error, results} = SchemaValidator.isValid(schema, req);

            if (error) {
				return res.status(400).json({
					status: 'error',
					type_error: 'VALIDATION_ERROR',
					message: SchemaValidator.getMessage(error)
				});
			}

            req.data = pickBy(results.data, value => !undefined(value));
			req.filter = pickBy(results.filter, value => !undefined(value));

            return next();
        }
    }
}