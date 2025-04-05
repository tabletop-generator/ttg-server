const logger = require("../../../logger");
const { z } = require("zod");
const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;
const asset = require("../../../model/asset");
const prisma = require("../../../model/data/prismaClient");
const { createSuccessResponse } = require("../../../response");

/**
 * Get an asset by its id
 */
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.assetId },
    `received request: GET /v1/assets/:assetId`,
  );

  // Validate UUID format
  try {
    z.string().uuid().parse(req.params.assetId);
  } catch (error) {
    logger.debug({ error }, "invalid asset ID format");
    return next({ status: 400, message: "Invalid uuid" });
  }

  // Get the asset with the associated user
  let foundAsset;
  try {
    foundAsset = await asset.get(req.params.assetId);
    // Fetch likes details for this asset
    const likes = await prisma.userAssetLike.findMany({
      where: { asset_id: foundAsset.id },
      include: { User: { select: { hashedEmail: true } } },
    });
    // Update like info: count and list of hashed emails
    foundAsset.likes = likes.length;
    foundAsset.likedBy = likes.map((like) => like.User.hashedEmail);

    logger.debug({ foundAsset }, "Retrieved asset");
  } catch (error) {
    logger.error({ error }, "Error fetching asset");

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return next({ status: 404, message: "Asset not found" });
    }
    return next({ status: 500, message: "Internal server error" });
  }

  // Disallow viewing other users' private assets
  if (
    foundAsset.visibility == "private" &&
    foundAsset.user.hashedEmail !== req.user
  ) {
    return next({ status: 403, message: "Forbidden" });
  }

  // Return the asset
  return res.status(200).json(createSuccessResponse({ asset: foundAsset }));
};
