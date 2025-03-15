const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const prisma = require("../../../model/data/prismaClient");
const { get: getUser } = require("../../../model/user");
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

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        assets: {
          select: {
            id: true,
            name: true,
            type: true,
            visibility: true,
          },
        },
        user: {
          select: {
            id: true,
            hashedEmail: true,
            displayName: true,
          },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({
        status: "error",
        error: { code: 404, message: "Collection not found" },
      });
    }

    if (collection.visibility !== "public") {
      try {
        const user = await getUser(req.user);
        if (user.id !== collection.creatorId) {
          return res.status(403).json({
            status: "error",
            error: { code: 403, message: "Forbidden" },
          });
        }
      } catch (error) {
        logger.error({ error }, "Error fetching collection");
        return res.status(403).json({
          status: "error",
          error: { code: 403, message: "Forbidden" },
        });
      }
    }

    const responseData = {
      id: collection.id,
      user: collection.user,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      name: collection.name,
      visibility: collection.visibility,
      assets: collection.assets,
    };

    return res
      .status(200)
      .json(createSuccessResponse({ collection: responseData }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next({ status: 400, message: "Invalid collection id" });
    }
    logger.error(error, "Error fetching collection");
    return next({ status: 500, message: "Internal server error" });
  }
};
