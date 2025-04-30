const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");
const { listComments } = require("../../../model/comment");

/**
 * Get the comments on an asset
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetId: req.params.assetId, query: req.query },
    `received request: GET /v1/assets/:assetId/comments`,
  );

  let comments;
  try {
    comments = await listComments(req.user, req.params.assetId, req.query);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error getting comments");
    return next(createHttpError(500, "Error getting comments"));
  }

  logger.info(
    { user: req.user, assetId: req.params.assetId, query: req.query },
    "comments retrieved",
  );

  return res.status(200).json({ comments });
};
