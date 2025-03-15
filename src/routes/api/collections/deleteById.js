const logger = require("../../../logger");
const { z } = require("zod");
const { createSuccessResponse } = require("../../../response");
const prisma = require("../../../model/data/prismaClient");
const { get } = require("../../../model/collection");

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.collectionId },
    "received request: DELETE /v1/collections/:collectionId",
  );

  const collectionIdParam = req.params.collectionId;

  let collectionId;
  try {
    collectionId = z.coerce.number().int().parse(collectionIdParam);
  } catch (error) {
    logger.debug({ error }, "Invalid collection ID format");
    return next({ status: 400, message: "Invalid collection ID" });
  }

  try {
    await get(collectionId, req.user);
  } catch (error) {
    logger.warn({ error }, "Error fetching collection");
    if (error.status === 403) {
      return next({ status: 403, message: "Forbidden" });
    } else if (
      error.code === "P2025" ||
      (error.message && error.message.includes("No Collection found"))
    ) {
      return next({ status: 404, message: "Collection not found" });
    } else {
      return next({ status: 500, message: "Internal server error" });
    }
  }

  try {
    await prisma.collection.delete({
      //def not the way to do it
      where: { id: collectionId },
    });

    logger.debug(collectionId, "Collection deleted");
    return res
      .status(200)
      .json(
        createSuccessResponse({ message: "Collection deleted successfully" }),
      );
  } catch (error) {
    logger.error(error, "Error deleting collection");
    return next({ status: 500, message: "Internal server error" });
  }
};
