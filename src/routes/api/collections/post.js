const logger = require("../../../logger");
const collection = require("../../../model/collection");
const { createSuccessResponse } = require("../../../response");

/**
 * Create a collection
 */
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/collections`,
  );

  // Validate request format
  try {
    collection.schema.parse(req.body);
  } catch (error) {
    logger.warn({ error }, "invalid collection data");
    const httpError = new Error("Invalid collection data");
    httpError.status = 400;
    return next(httpError);
  }

  // Save collection
  let newCollection;
  try {
    newCollection = await collection.save(req.user, req.body);
  } catch (error) {
    logger.warn({ error, requestBody: req.body }, "error creating collection");
    return next(error);
  }

  logger.info(
    {
      collectionId: newCollection.id,
      collectionName: newCollection.name,
      userId: req.user,
    },
    "user created new collection",
  );

  // Create location URL for the new collection
  const locationURL = new URL(
    `/v1/collections/${newCollection.id}`,
    process.env?.API_URL || `https://${req.headers?.host}`,
  );

  logger.debug(
    { locationURL, collection: newCollection },
    `constructed URL for Location header for new collection`,
  );

  // Return collection data
  return res
    .status(201)
    .set("Location", locationURL)
    .json(createSuccessResponse({ collection: newCollection }));
};
