const logger = require("../../../lib/logger");
const { createSuccessResponse } = require("../../../lib/response");

/**
 * Get a list of collections filtered by the query
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/collections`,
  );

  return res.status(418).json(createSuccessResponse());
};
