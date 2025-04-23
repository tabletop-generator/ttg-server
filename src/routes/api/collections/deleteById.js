const logger = require("../../../lib/logger");
const { createSuccessResponse } = require("../../../lib/response");

/**
 * Delete a collection by it's id
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: DELETE /v1/collections/:collectionId`,
  );

  return res.status(418).json(createSuccessResponse());
};
