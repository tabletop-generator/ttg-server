const logger = require("../../../lib/logger");

/**
 * Get comments for an asset using the asset id in the query
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/comments`,
  );

  return res.status(418);
};
