const logger = require("../../../lib/logger");

/**
 * Create a comment
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/comments`,
  );

  return res.status(418);
};
