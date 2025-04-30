const { getAsset } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Get an asset by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetIdParam: req.params.assetId },
    `received request: GET /v1/assets/:assetId`,
  );

  let asset;
  try {
    asset = await getAsset(req.params.assetId, req.user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error getting asset");
    return next(createHttpError(500, "Error getting asset"));
  }

  return res.status(200).json(asset);
};
