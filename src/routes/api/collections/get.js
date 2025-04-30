const { listCollections } = require("../../../model/collection");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Get a list of collections filtered by the query
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/collections`,
  );

  let collections;
  try {
    collections = await listCollections(req.user, req.query);
  } catch (error) {
    logger.error(
      { error, message: error.message },
      "error getting collection list",
    );
    return next(createHttpError(500, "Error getting collection list"));
  }

  return res.status(200).json({ collections });
};
