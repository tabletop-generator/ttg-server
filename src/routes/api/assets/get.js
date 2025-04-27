const { logger } = require("../../../lib/logger");

/**
 * Get a list of assets filtered by the query
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/assets`,
  );

  return res.status(418);
};
