const logger = require("../../../logger");
const z = require("zod");
const { createSuccessResponse } = require("../../../response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.collectionId },
    `received request: DELETE /v1/collections/:collectionId`,
  );

  const collectionIdParam = req.params.collectionId;

  let collectionId;
  try {
    collectionId = z.coerce.number().int().parse(collectionIdParam);
  } catch (error) {
    logger.debug({ error }, "Invalid collection ID format");
    return next({ status: 400, message: "Invalid collection ID" });
  }

  let collection;
  try {
    collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        user: true,
      },
    });
  } catch (error) {
    logger.error(error, "Error fetching collection");
    return next({ status: 500, message: "Internal server error" });
  }

  if (!collection) {
    logger.debug("Collection not found");
    return next({ status: 404, message: "Collection not found" });
  }

  if (collection.user.hashedEmail !== req.user) {
    return next({
      status: 403,
      message: "Forbidden: You do not own this collection",
    });
  }

  try {
    await prisma.collection.delete({
      where: { id: collectionId },
    });

    logger.debug(collectionId, "Collection deleted");
    return res.status(200).json(
      createSuccessResponse({
        message: "Collection deleted successfully",
      }),
    );
  } catch (error) {
    logger.error(error, "Error deleting collection");
    return next({ status: 500, message: "Internal server error" });
  }
};
