const logger = require("../../../logger");
const { z } = require("zod");
const prisma = require("../../../model/data/prismaClient");
const { createSuccessResponse } = require("../../../response");

// Schema for PATCH request validation
const patchSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    visibility: z.enum(["public", "private", "unlisted"]).optional(),
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

  // Check if user owns the asset
  if (asset.user.hashedEmail !== req.user) {
    return next({ status: 403, message: "forbidden" });
  }

  // Update the asset
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
