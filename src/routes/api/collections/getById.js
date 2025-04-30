const { getCollection } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Get a collection by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, collectionId: req.params.collectionId },
    `received request: GET /v1/collections/:collectionId`,
  );

  let collection;
  try {
    collection = await getCollection(req.user, req.params.collectionId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error({ error, message: error.message }, "error getting collection");
    return next(createHttpError(500, "Error getting collection"));
  }

  return res.status(200).json(collection);
};
