function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

class NotFoundError extends Error {}
class ForbiddenError extends Error {}

module.exports = { createHttpError, NotFoundError, ForbiddenError };
