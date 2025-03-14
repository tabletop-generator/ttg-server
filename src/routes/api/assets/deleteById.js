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
    { user: req.user, id: req.params.id },
    `received request: DELETE /v1/assets/:assetId`,
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
    logger.warn(error, "asset not found");
    return next({ status: 404, message: "Asset not found" });
  }

  try {
    deleteAsset(asset.uuid, req.user);
    logger.info(asset.uuid, "Asset deleted");
    return res
      .status(200)
      .json(createSuccessResponse({ message: "Asset deleted successfully" }));
  } catch (error) {
    if (error.code === "P2025") {
      logger.warn("Asset for the user not found");
      return next({
        status:
          error.meta?.cause === "Record to delete does not exist" ? 403 : 404,
        message:
          error.meta?.cause === "Record to delete does not exist"
            ? "Forbidden"
            : "Asset not found",
      });
    }

    logger.error(error, "Error deleting asset");
    return next({ status: 500, message: "Internal server error" });
  }
};
