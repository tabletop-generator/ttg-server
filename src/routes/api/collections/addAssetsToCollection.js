const { addAssetsToCollection } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const {
  createHttpError,
  NotFoundError,
  ForbiddenError,
} = require("../../../lib/error");

/**
 * Add a list of assets to a collection
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, collectionId: req.params.collectionId, body: req.body },
    `received request: POST /v1/collections/:collectionId/assets`,
  );

  let collection;
  try {
    collection = await addAssetsToCollection(
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
      "error adding assets to collection",
    );
    return next(createHttpError(500, "Error adding assets to collection"));
  }

  logger.info(
    {
      user: req.user,
      collectionId: collection.collectionId,
      assetIds: req.body.assetIds,
    },
    "assets added to collection",
  );

  return res.status(200).json(collection);
};
