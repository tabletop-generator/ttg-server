const logger = require("../../../logger");
const { z } = require("zod");
const prisma = require("../../../model/data/prismaClient");
const asset = require("../../../model/asset");
const { createSuccessResponse } = require("../../../response");

// Schema for query validation
const querySchema = z
  .object({
    name: z.string().optional(),
    type: z.enum(["character", "quest", "map", "location"]).optional(),
    userId: z.string().optional(),
    visibility: z.enum(["public", "private", "unlisted"]).optional(),
    expand: z.enum(["true", "false"]).optional(),
  })
  .strict();

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
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/assets`,
  );

  // Validate query parameters
  try {
    querySchema.parse(req.query);
  } catch (error) {
    logger.debug({ error }, "invalid query parameters");
    return next({ status: 400, message: "Invalid query parameters" });
  }

  const { name, type, userId, visibility, expand } = req.query;

  try {
    // Get the authenticated user's ID if available
    let authenticatedUserId;
    if (req.user) {
      const user = await prisma.user.findUnique({
        where: { hashedEmail: req.user },
        select: { id: true },
      });
      if (user) {
        authenticatedUserId = user.id;
      }
    }

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
      where.creatorId = parseInt(userId, 10);
    }

    if (visibility) {
      where.visibility = visibility;
    }

    // Visibility filter logic
    if (
      userId &&
      authenticatedUserId &&
      parseInt(userId, 10) === authenticatedUserId
    ) {
      // Case 1: User is viewing their own assets - no visibility filter needed
    } else if (userId) {
      // Case 2: User is viewing someone else's assets - only public
      where.visibility = "public";
    } else if (!authenticatedUserId) {
      // Case 3: No authentication - only show public assets
      where.visibility = "public";
    } else {
      // Case 4: Authenticated user, no specific userId
      where.OR = [
        { visibility: "public" },
        {
          creatorId: authenticatedUserId,
          visibility: { in: ["private", "unlisted"] },
        },
      ];
    }

    // Get assets from database
    const assetResults = await prisma.asset.findMany({
      where,
      select: {
        uuid: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Format response based on expand parameter
    if (expand === "true") {
      // Fetch full asset details for each UUID using asset.get
      const detailedAssets = await Promise.all(
        assetResults.map(async (result) => {
          try {
            return await asset.get(result.uuid);
          } catch (error) {
            logger.error(
              { error, uuid: result.uuid },
              "Error fetching asset details",
            );
            return null;
          }
        }),
      );

      // Filter out any nulls (failed fetches)
      const validAssets = detailedAssets.filter((asset) => asset !== null);

      // Format the assets for the response
      const formattedAssets = validAssets.map((asset) => ({
        uuid: asset.uuid,
        name: asset.name,
        type: asset.type,
        visibility: asset.visibility,
        description: asset.description,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
        isFeatured: asset.isFeatured,
        likes: asset.likes,
        imageUrl: asset.imageUrl,
        user: {
          hashedEmail: asset.user.hashedEmail,
          displayName: asset.user.displayName,
        },
        ...(asset.type === "character" && { character: asset.character }),
        ...(asset.type === "location" && { location: asset.location }),
        ...(asset.type === "map" && { map: asset.map }),
        ...(asset.type === "quest" && { quest: asset.quest }),
      }));

      return res.status(200).json(
        createSuccessResponse({
          assets: formattedAssets,
        }),
      );
    } else {
      // Return just the UUIDs
      return res.status(200).json(
        createSuccessResponse({
          assets: assetResults.map((asset) => asset.uuid),
        }),
      );
    }
  } catch (error) {
    logger.error({ error }, "Error fetching assets");
    return next({ status: 500, message: "Internal server error" });
  }
};
