const { createCollection } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Create a collection
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/collections`,
  );

  let collection;
  try {
    collection = await createCollection(req.user, req.body);
  } catch (error) {
    logger.error(
      { error, message: error.message },
      "error creating collection",
    );
    return next(createHttpError(500, "Error creating collection"));
  }

  return res.status(200).json(collection);
};
