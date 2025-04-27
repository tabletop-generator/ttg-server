const { logger } = require("../../../lib/logger");

/**
 * Get a list of assets filtered by the query
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetIdParam: req.params.assetId },
    `received request: POST /v1/assets/:assetId/like`,
  );

  return res.status(418);
};
