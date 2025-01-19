const logger = require("../../../logger");
const prisma = require("../../../prisma");
const { createSuccessResponse } = require("../../../response");

/**
 * Get a list of assets filtered by the query
 * Query parameters:
 * - name: string
 * - type: asset_type (character, quest, map, location)
 * - userId: number
 * - visibility: visibility_type (public, private, unlisted)
 * - expand: boolean
 */
module.exports = async (req, res, next) => {
  try {
    logger.debug(
      { user: req.user, query: req.query },
      `received request: GET /v1/assets`,
    );

    const { name, type, userId, visibility, expand } = req.query;

    // Build where clause based on query parameters
    const where = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (type) {
      where.type = type;
    }

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (visibility) {
      where.visibility = visibility;
    }

    // If not querying for a specific user, only show public assets
    // Unless the request is from the asset owner
    if (!userId) {
      where.OR = [
        { visibility: "public" },
        {
          userId: req.user?.userId,
          visibility: { in: ["private", "unlisted"] },
        },
      ];
    }

    // Get assets from database with type-specific data
    const assets = await prisma.asset.findMany({
      where,
      include: {
        characterAsset: true,
        locationAsset: true,
        questAsset: true,
        mapAsset: true,
      },
      orderBy: {
        updatedDate: "desc",
      },
    });

    // If expand is not true, return just the IDs
    if (expand !== "true") {
      return res.status(200).json(
        createSuccessResponse({
          assets: assets.map((asset) => asset.assetId),
        }),
      );
    }

    // Return full asset objects
    return res.status(200).json(
      createSuccessResponse({
        assets: assets.map((asset) => {
          // Get the specific asset type data
          const typeData = asset[`${asset.type}Asset`];

          return {
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
          };
        }),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error getting assets");
    next(err);
  }
};
