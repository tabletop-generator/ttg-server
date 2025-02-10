const logger = require("../../../logger");
const prisma = require("../../../model/data/prismaClient");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../../response");

/**
 * Get an asset by its id
 */
module.exports = async (req, res, next) => {
  try {
    logger.debug(
      { user: req.user, id: req.params.assetId },
      `received request: GET /v1/assets/:assetId`,
    );

    const assetId = parseInt(req.params.assetId);
    if (isNaN(assetId)) {
      return res
        .status(400)
        .json(createErrorResponse(400, "Invalid asset ID format"));
    }

    // Get asset with type-specific data
    const asset = await prisma.asset.findUnique({
      where: { assetId },
      include: {
        characterAsset: true,
        locationAsset: true,
        questAsset: true,
        mapAsset: true,
      },
    });

    // Check if asset exists
    if (!asset) {
      return res.status(404).json(createErrorResponse(404, "Asset not found"));
    }

    // Check visibility permissions
    if (asset.visibility !== "public" && asset.userId !== req.user?.userId) {
      return res
        .status(403)
        .json(createErrorResponse(403, "Not authorized to view this asset"));
    }

    // Get the specific asset type data
    const typeData = asset[`${asset.type}Asset`];

    // Return the asset
    return res.status(200).json(
      createSuccessResponse({
        asset: {
          id: asset.assetId,
          ownerId: asset.userId,
          created: asset.createdDate,
          updated: asset.updatedDate,
          name: asset.name,
          visibility: asset.visibility,
          likes: asset.likes,
          type: asset.type,
          imageUrl: asset.imageUrl,
          imageUrlExpiry: asset.imageUrlExpiry,
          ...typeData,
        },
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error getting asset by ID");
    next(err);
  }
};
