const { deleteCollection } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Delete a collection by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, collectionId: req.params.collectionId },
    `received request: DELETE /v1/collections/:collectionId`,
  );

  try {
    await deleteCollection(req.user, req.params.collectionId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error(
      { error, message: error.message },
      "error deleting collection",
    );
    return next(createHttpError(500, "Error deleting collection"));
  }

  logger.info(
    { user: req.user, collectionId: req.params.collectionId },
    "collection deleted",
  );

  return res.status(204).send();
};
