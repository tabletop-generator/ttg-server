const { toggleAssetLike } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Toggle like status for an asset for the current user
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetId: req.params.assetId },
    `received request: POST /v1/assets/:assetId/like`,
  );

  let like;
  try {
    like = await toggleAssetLike(req.params.assetId, req.user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error(
      { error, message: error.message },
      "error toggling asset like status",
    );
    return next(createHttpError(500, "Error toggling asset like status"));
  }

  logger.info(
    { user: req.user, assetId: like.assetId },
    "asset like status toggled",
  );

  return res.status(200).json(like);
};
