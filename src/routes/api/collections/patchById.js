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
    { user: req.user, id: req.params.id },
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

  let updatedCollection;
  try {
    updatedCollection = await prisma.collection.update({
      where: { id: req.params.id, creatorId: req.user },
      data: {
        name: req.body?.name,
        description: req.body?.description,
        visibility: req.body?.visibility,
        assets: {
          connect: req.body?.assetsToAdd.map((assetId) => ({ id: assetId })),
          disconnect: req.body?.assetsToRemove.map((assetId) => ({
            id: assetId,
          })),
        },
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

  logger.info(
    { userId: req.user, collectionId: updatedCollection.id },
    "updated collection",
  );
  logger.debug(
    {
      updatedCollection,
    },
    "updated collection: debug info",
  );

  return res
    .status(200)
    .json(createSuccessResponse({ collection: updatedCollection }));
};
