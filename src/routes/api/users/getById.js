const logger = require("../../../lib/logger");
const { createSuccessResponse } = require("../../../lib/response");

/**
 * Get a user by their id
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: GET /v1/users/:userId`,
  );

  return res.status(418).json(createSuccessResponse());
};
