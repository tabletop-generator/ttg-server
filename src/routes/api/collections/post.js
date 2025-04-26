const logger = require("../../../lib/logger");

/**
 * Create a collection
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/collections`,
  );

  return res.status(418);
};
