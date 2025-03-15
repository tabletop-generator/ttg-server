const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const { get } = require("../../../model/collection");
const { z } = require("zod");

const getCollectionSchema = z.object({
  params: z.object({
    collectionId: z.coerce
      .number()
      .int()
      .positive({ message: "Collection ID must be a positive integer" }),
  }),
});

module.exports = async (req, res, next) => {
  try {
    const { params } = getCollectionSchema.parse({
      params: req.params,
    });
    const collectionId = params.collectionId;

    let collection;
    try {
      collection = await get(collectionId);
    } catch (error) {
      logger.warn({ error }, "Collection not found");
      return next({ status: 404, message: "Collection not found" });
    }

    if (collection.visibility !== "public" && collection.ownerId !== req.user) {
      logger.warn("User not authorized to access private collection");
      return next({ status: 403, message: "Forbidden" });
    }

    return res
      .status(200)
      .json(createSuccessResponse({ collection: collection }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next({ status: 400, message: "Invalid collection id" });
    }
    logger.error(error, "Error fetching collection");
    return next({ status: 500, message: "Internal server error" });
  }
};
