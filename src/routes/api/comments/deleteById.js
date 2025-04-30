const { deleteComment } = require("../../../model/comment");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Delete a comment by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, commentId: req.params.commentId },
    `received request: DELETE /v1/comments/:commentId`,
  );

  try {
    await deleteComment(req.user, req.params.commentId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error deleting comment");
    return next(createHttpError(500, "Error deleting comment"));
  }

  return res.status(204).send();
};
