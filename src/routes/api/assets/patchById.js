const logger = require("../../../logger");
const prisma = require("../../../model/data/prismaClient");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../../response");

/**
 * Update an asset by its id
 */
module.exports = async (req, res, next) => {
  try {
    const assetId = Number(req.params.assetId);

    // Add debug logging
    logger.debug(
      {
        params: req.params,
        assetId: assetId,
        isNaN: isNaN(assetId),
        user: req.user,
        body: req.body,
      },
      "PATCH request details",
    );

    // Validate assetId is a number
    if (isNaN(assetId)) {
      return res.status(400).json(createErrorResponse(400, "invalid asset id"));
    }

    logger.debug(
      { user: req.user, assetId, body: req.body },
      "received request: PATCH /v1/assets/:assetId",
    );

    // Find the asset and its creator
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        user: {
          select: {
            hashedEmail: true,
          },
        },
      },
    });

    // Add more debug logging
    logger.debug(
      {
        assetFound: !!asset,
        assetDetails: asset,
        requestUser: req.user,
      },
      "Asset lookup results",
    );

    // Check if asset exists
    if (!asset) {
      return res.status(404).json(createErrorResponse(404, "asset not found"));
    }

    // Check if user owns the asset
    if (asset.user.hashedEmail !== req.user) {
      return res.status(403).json(createErrorResponse(403, "forbidden"));
    }

    // Update the asset
    const updatedAsset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        name: req.body.name,
        description: req.body.description,
        visibility: req.body.visibility,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json(createSuccessResponse({ asset: updatedAsset }));
  } catch (err) {
    logger.error({ err }, "Error updating asset");
    next(err);
  }
};
