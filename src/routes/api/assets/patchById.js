const logger = require("../../../logger");
const { z } = require("zod");
const prisma = require("../../../model/data/prismaClient");
const { createSuccessResponse } = require("../../../response");

// Schema for PATCH request validation
const patchSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    visibility: z.enum(["public", "private", "unlisted"]).optional(),
    like: z.boolean().optional(),
  })
  .strict();

/**
 * Update an asset by its id
 */
module.exports = async (req, res, next) => {
  logger.debug(
    {
      params: req.params,
      assetId: req.params.assetId,
      user: req.user,
      body: req.body,
    },
    `received request: PATCH /v1/assets/:assetId`,
  );

  // Validate request body
  try {
    patchSchema.parse(req.body);
  } catch (error) {
    logger.debug({ error }, "invalid request body");
    error.status = 400;
    error.message = "Invalid request format";
    return next(error);
  }

  // Validate UUID format
  try {
    z.string().uuid().parse(req.params.assetId);
  } catch (error) {
    logger.debug({ error }, "invalid asset ID format");
    return next({ status: 400, message: "invalid asset id" });
  }

  let currentUser;
  try {
    currentUser = await prisma.user.findUnique({
      where: { hashedEmail: req.user },
      select: { id: true },
    });
  } catch (error) {
    logger.error({ error }, "Error fetching user");
    return next({ status: 500, message: "Internal server error" });
  }
  if (!currentUser) {
    return next({ status: 404, message: "User not found" });
  }

  // Find the asset and its creator
  let asset;
  try {
    asset = await prisma.asset.findUnique({
      where: { uuid: req.params.assetId },
      include: {
        user: {
          select: {
            hashedEmail: true,
          },
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Error fetching asset");
    return next({ status: 500, message: "Internal server error" });
  }

  // Check if asset exists
  if (!asset) {
    logger.debug("asset not found");
    return next({ status: 404, message: "asset not found" });
  }

  // Log asset details only if found
  logger.debug({ asset }, "Asset found");

  // Process like/unlike toggle action
  if (req.body.like !== undefined) {
    try {
      const existingLike = await prisma.userAssetLike.findUnique({
        where: {
          user_id_asset_id: {
            user_id: currentUser.id,
            asset_id: asset.id,
          },
        },
      });

      if (existingLike) {
        await prisma.userAssetLike.delete({
          where: {
            user_id_asset_id: {
              user_id: currentUser.id,
              asset_id: asset.id,
            },
          },
        });
      } else {
        await prisma.userAssetLike.create({
          data: {
            user_id: currentUser.id,
            asset_id: asset.id,
          },
        });
      }

      // Update likes count in Asset table
      const newLikeCount = await prisma.userAssetLike.count({
        where: { asset_id: asset.id },
      });

      const updatedAsset = await prisma.asset.update({
        where: { id: asset.id },
        data: { likes: newLikeCount, updatedAt: new Date() },
        select: { likes: true },
      });

      return res.status(200).json({ status: "ok", likes: updatedAsset.likes });
    } catch (error) {
      logger.error({ error }, "Error updating likes");
      return next({ status: 500, message: "Internal server error" });
    }
  }

  // Check if user owns the asset before updating asset details
  if (asset.user.hashedEmail !== req.user) {
    return next({ status: 403, message: "forbidden" });
  }

  // Update asset details (name, description, visibility)
  try {
    const updatedAsset = await prisma.asset.update({
      where: { id: asset.id },
      data: {
        name: req.body.name,
        description: req.body.description,
        visibility: req.body.visibility,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json(createSuccessResponse({ asset: updatedAsset }));
  } catch (error) {
    logger.error({ error }, "Error updating asset");
    return next({ status: 500, message: "Internal server error" });
  }
};
