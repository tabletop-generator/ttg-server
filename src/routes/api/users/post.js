const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");

/**
 * Create the current user if they don't already exist
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/users`,
  );

  return res.status(418).json(createSuccessResponse());
};
