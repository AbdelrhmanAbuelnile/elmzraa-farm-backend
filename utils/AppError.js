/* eslint-disable prettier/prettier */
class AppError extends Error {
	constructor(message, statusCode,errors) {
			super(message);
			this.statusCode = statusCode;
			this.errors = errors;
	}
}

module.exports = AppError;