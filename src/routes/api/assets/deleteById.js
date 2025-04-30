const { deleteAsset } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Delete an asset by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetIdParam: req.params.assetId },
    `received request: DELETE /v1/assets/:assetId`,
  );

  try {
    await deleteAsset(req.params.assetId, req.user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error deleting asset");
    return next(createHttpError(500, "Error deleting asset"));
  }

  logger.info({ user: req.user, assetId: req.params.assetId }, "asset deleted");

  return res.status(204).send();
};
