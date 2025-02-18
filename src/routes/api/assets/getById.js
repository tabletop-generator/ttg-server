const logger = require("../../../logger");
const prisma = require("../../../model/data/prismaClient");
const { z } = require("zod");
const { createSuccessResponse } = require("../../../response");
const assetModel = require("../../../model/asset");

/**
 * Get an asset by its id
 */
module.exports = async (req, res, next) => {
  try {
    logger.debug(
      { user: req.user, id: req.params.assetId },
      `received request: GET /v1/assets/:assetId`,
    );

    // Validate UUID format
    try {
      z.string().uuid().parse(req.params.assetId);
    } catch (error) {
      logger.debug({ error }, "invalid asset ID format");
      error.status = 400;
      error.message = "Invalid asset ID format";
      return next(error);
    }

    // Get asset with all type-specific data
    const asset = await prisma.asset.findUnique({
      where: { uuid: req.params.assetId },
      include: {
        character: true,
        user: true,
        comments: true,
        collections: true,
      },
    });

    // Check if asset exists
    if (!asset) {
      const error = new Error("Asset not found");
      error.status = 404;
      return next(error);
    }

    // Check visibility permissions
    if (asset.visibility !== "public" && asset.creatorId !== req.user?.id) {
      const error = new Error("Not authorized to view this asset");
      error.status = 403;
      return next(error);
    }

    // Check if image URL is expired and regenerate if needed
    if (
      asset.imageUrl &&
      (!asset.imageUrlExpiry || asset.imageUrlExpiry <= new Date())
    ) {
      try {
        const updatedAsset = await assetModel.refreshImageUrl(asset);
        asset.imageUrl = updatedAsset.imageUrl;
        asset.imageUrlExpiry = updatedAsset.imageUrlExpiry;
      } catch (error) {
        logger.error({ error }, "Error regenerating image URL");
        // Continue without image URL if regeneration fails
        asset.imageUrl = null;
        asset.imageUrlExpiry = null;
      }
    }

    // Return the asset with character data if it exists
    return res.status(200).json(
      createSuccessResponse({
        asset: {
          id: asset.id,
          uuid: asset.uuid,
          creatorId: asset.creatorId,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
          name: asset.name,
          visibility: asset.visibility,
          likes: asset.likes,
          type: asset.type,
          imageUrl: asset.imageUrl,
          imageUrlExpiry: asset.imageUrlExpiry,
          character: asset.character,
        },
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error getting asset by ID");
    return next(err);
  }
};
