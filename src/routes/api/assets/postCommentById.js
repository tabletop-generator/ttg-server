const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");
const { createComment } = require("../../../model/comment");

/**
 * Create a comment on an asset
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetId: req.params.assetId, body: req.body },
    `received request: POST /v1/assets/:assetId/comments`,
  );

  let comment;
  try {
    comment = await createComment(req.user, req.params.assetId, req.body);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error creating comment");
    return next(createHttpError(500, "Error creating comment"));
  }

  logger.info(
    {
      user: req.user,
      assetId: req.params.assetId,
      commentId: comment.commentId,
    },
    "comment created",
  );

  return res.status(201).json(comment);
};
