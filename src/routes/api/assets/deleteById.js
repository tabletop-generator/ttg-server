const logger = require("../../../logger");
const z = require("zod");
const { delete: deleteAsset } = require("../../../model/asset");
const { createSuccessResponse } = require("../../../response");
const prisma = require("../../../model/data/prismaClient");

/**
 * Delete an asset by its id after verifying ownership
 */
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetId: req.params.assetId },
    "received request: DELETE /v1/assets/:assetId",
  );

  const assetId = req.params.assetId;

  try {
    z.string().uuid().parse(assetId);
  } catch (error) {
    logger.warn({ error }, "invalid asset ID format");
    return next({ status: 400, message: "invalid asset id" });
  }

  let asset;
  try {
    asset = await prisma.asset.findUnique({
      where: { uuid: assetId },
      include: {
        character: true,
        user: true,
      },
    });
  } catch (error) {
    logger.error(error, "Error fetching asset");
    return next({ status: 500, message: "Internal server error" });
  }

  if (!asset) {
    logger.warn("Asset not found");
    return next({ status: 404, message: "Asset not found" });
  }

  try {
    await deleteAsset(asset.uuid, req.user);
  } catch (error) {
    if (error.code === "P2025") {
      logger.warn("Asset for the user not found during deletion");
      return next({ status: 403, message: "Forbidden" });
    }
    logger.error(error, "Error deleting asset");
    return next({ status: 500, message: "Internal server error" });
  }

  logger.info(asset.uuid, "Asset deleted");
  return res
    .status(200)
    .json(createSuccessResponse({ message: "Asset deleted successfully" }));
};
