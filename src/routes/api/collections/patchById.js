const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;
const { z } = require("zod");
const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const prisma = require("../../../model/data/prismaClient");

/**
 * Update a collection by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.collectionId },
    `received request: PATCH /v1/collections/:collectionId`,
  );

  // Validate request body
  try {
    const updateSchema = z
      .object({
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        visibility: z.enum(["public", "private", "unlisted"]).optional(),
        assetsToAdd: z.string().uuid().array().optional(),
        assetsToRemove: z.string().uuid().array().optional(),
      })
      .strict();

    updateSchema.parse(req.body);
  } catch (error) {
    logger.info({ error }, "invalid request body");
    return next({ status: 400, message: "Invalid request format" });
  }

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

  // Get the current user's serial id
  let currentUserId;
  try {
    ({ id: currentUserId } = await prisma.user.findUniqueOrThrow({
      where: {
        hashedEmail: req.user,
      },
    }));
  } catch (error) {
    logger.warn(
      { error },
      "error retrieving current user when updating collection",
    );
    return next({ status: 500, message: "Error updating collection" });
  }

  // If adding assets, filter out other users' private assets
  let assetsToConnect = [];
  if (req.body?.assetsToAdd) {
    try {
      assetsToConnect = await prisma.asset.findMany({
        select: { id: true, uuid: true },
        where: {
          uuid: { in: req.body?.assetsToAdd },
          OR: [
            {
              creatorId: {
                equals: currentUserId, // If the current user owns it, allow it
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
    uuid: assetId,
  }));

  // Update the collection
  let updatedCollection;
  try {
    updatedCollection = await prisma.collection.update({
      where: { id: collectionId, creatorId: currentUserId },
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
            hashedEmail: true,
          },
        },
        assets: {
          select: {
            uuid: true,
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

  return res.status(200).json(
    createSuccessResponse({
      collection: {
        id: updatedCollection.id,
        ownerId: updatedCollection.user.hashedEmail,
        createdAt: updatedCollection.createdAt,
        updatedAt: updatedCollection.updatedAt,
        name: updatedCollection.name,
        description: updatedCollection.description,
        visibility: updatedCollection.visibility,
        assets: updatedCollection.assets.map((asset) => asset.uuid),
      },
    }),
  );
};
