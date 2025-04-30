const { updateCollection } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Update a collection by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, collectionId: req.params.collectionId, body: req.body },
    `received request: PATCH /v1/collections/:collectionId`,
  );

  let collection;
  try {
    collection = await updateCollection(
      req.user,
      req.params.collectionId,
      req.body,
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(createHttpError(404, "Not Found"));
    }
    if (error instanceof ForbiddenError) {
      return next(createHttpError(403, "Forbidden"));
    }

    logger.error(
      { error, message: error.message },
      "error updating collection",
    );
    return next(createHttpError(500, "Error updating collection"));
  }

  logger.info(
    { user: req.user, collectionId: collection.id },
    "collection updated",
  );

  return res.status(200).json(collection);
};
