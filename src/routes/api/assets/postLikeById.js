const { toggleAssetLike } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Toggle like status for an asset for the current user
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetIdParam: req.params.assetId },
    `received request: POST /v1/assets/:assetId/like`,
  );

  let like;
  try {
    like = await toggleAssetLike(req.params.assetId, req.user);
  } catch (error) {
    if (error.message === "Not Found") {
      return next(createHttpError(404, "Not Found"));
    }

    if (error.message === "Forbidden") {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error }, "error toggling asset like status");
    return next(createHttpError(500, "Error toggling asset like status"));
  }

  return res.status(200).json(like);
};
