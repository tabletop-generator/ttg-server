const logger = require("../../../lib/logger");

/**
 * Get an asset by it's id
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: GET /v1/assets/:assetId`,
  );

  return res.status(418);
};
