const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");

/**
 * Generate and save an asset
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/assets`,
  );

  return res.status(418).json(createSuccessResponse());
};
