const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");

/**
 * Update the current user
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: PATCH /v1/users`,
  );

  return res.status(418).json(createSuccessResponse());
};
