const { deleteAsset } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

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
    logger.error({ error }, "error deleting asset");

    if (error.message === "Not Found") {
      return next(createHttpError(404, "Not Found"));
    }
    if (error.message === "Forbidden") {
      return next(createHttpError(403, "Forbidden"));
    }
    return next(createHttpError(500, "Error deleting asset"));
  }

  return res.status(204).send();
};
