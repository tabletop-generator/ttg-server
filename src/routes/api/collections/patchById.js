const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;
const logger = require("../../../lib/logger");
const prisma = require("../../../model/data/prismaClient");

/**
 * Update a collection by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.collectionId },
    `received request: PATCH /v1/collections/:collectionId`,
  );

  // Validate id parameter and convert to int
  const collectionId = parseInt(req.params.collectionId);
  if (isNaN(collectionId)) {
    return next({ status: 400, message: "invalid collection id" });
  }

  // Identify asset IDs that are both in the add and remove array
  // Remove the common IDs from the remove array. We'll just add them.
  const assetsToAdd = req.body?.assetsToAdd || [];
  const assetsToRemove =
    req.body?.assetsToRemove?.filter((id) => !assetsToAdd.includes(id)) || [];

  // If adding assets, filter out other users' private assets
  let assetsToConnect = [];
  if (req.body?.assetsToAdd) {
    try {
      assetsToConnect = await prisma.asset.findMany({
        select: { id: true },
        where: {
          id: { in: req.body?.assetsToAdd },
          OR: [
            {
              creatorId: {
                equals: req.user, // If the current user owns it, allow it
              },
            },
            {
              visibility: {
                not: "private", // Otherwise, it must be public or unlisted
              },
            },
          ],
        },
      });
    } catch (error) {
      logger.warn(
        { error },
        "error retrieving assets when updating collection",
      );
      return next({ status: 500, message: "Error updating collection" });
    }
  }

  assetsToConnect = assetsToConnect.map((asset) => ({ id: asset.id }));
  const assetsToDisconnect = assetsToRemove.map((assetId) => ({
    id: assetId,
  }));

  // Update the collection
  let updatedCollection;
  try {
    updatedCollection = await prisma.collection.update({
      where: { id: collectionId, creatorId: req.user },
      data: {
        name: req.body?.name,
        description: req.body?.description,
        visibility: req.body?.visibility,
        assets: {
          disconnect: assetsToDisconnect,
          connect: assetsToConnect,
        },
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        assets: {
          select: {
            id: true,
          },
        },
      },
      omit: {
        creatorId: true,
      },
    });
  } catch (error) {
    logger.warn({ error }, "error updating collection");
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return next({ status: 404, message: "Collection not found" });
    }
    return next({ status: 500, message: "Error updating collection" });
  }

  logger.info({ collectionId: updatedCollection.id }, "updated collection");
  logger.debug(
    {
      updatedCollection,
    },
    "updated collection: debug info",
  );

  return res.status(200).json(updatedCollection);
};
