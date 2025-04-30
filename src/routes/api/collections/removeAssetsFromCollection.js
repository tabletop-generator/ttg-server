const { removeAssetsFromCollection } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Remove a list of assets from a collection
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, collectionId: req.params.collectionId, body: req.body },
    `received request: POST /v1/collections/:collectionId/assets/remove`,
  );

  let collection;
  try {
    collection = await removeAssetsFromCollection(
      req.user,
      req.params.collectionId,
      req.body.assetIds,
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
      "error removing assets from collection",
    );
    return next(createHttpError(500, "Error removing assets from collection"));
  }

  logger.info(
    {
      user: req.user,
      collectionId: collection.collectionId,
      assetIds: req.body.assetIds,
    },
    "assets removed from collection",
  );

  return res.status(200).json(collection);
};
