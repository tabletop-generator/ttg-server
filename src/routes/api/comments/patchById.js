const { updateComment } = require("../../../model/comment");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Update a comment by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, commentId: req.params.commentId, body: req.body },
    `received request: PATCH /v1/comments/:commentId`,
  );

  let comment;
  try {
    comment = await updateComment(req.user, req.params.commentId, req.body);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error updating comment");
    return next(createHttpError(500, "Error updating comment"));
  }

  logger.info(
    { user: req.user, commentId: req.params.commentId },
    "comment updated",
  );

  return res.status(200).json(comment);
};
