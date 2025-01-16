const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");

/**
 * Delete an asset by it's id
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: DELETE /v1/assets/:assetId`,
  );

  return res.status(418).json(createSuccessResponse());
};
