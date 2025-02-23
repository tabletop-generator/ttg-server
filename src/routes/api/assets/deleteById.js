const logger = require("../../../logger");
const validator = require("validator");
const { deleteAsset, get } = require("../../../model/asset");
const { createSuccessResponse } = require("../../../response");
const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;
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

  if (!validator.isUUID(assetId)) {
    return next({ status: 400, message: "Invalid UUID" });
  }

  let asset;
  try {
    asset = await get(assetId);
  } catch (error) {
    logger.error(error, "Error fetching asset");

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return next({ status: 404, message: "Asset not found" });
    }

    return next({ status: 500, message: "Internal server error" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { hashedEmail: req.user },
    });

    if (!user) {
      return next({ status: 404, message: "User not found" });
    }

    if (user.id !== asset.creatorId) {
      return next({
        status: 403,
        message: "Forbidden",
      });
    }
  } catch (error) {
    logger.error(error, "Error verifying asset ownership");
    return next({ status: 500, message: "Internal server error" });
  }

  try {
    await deleteAsset(asset.uuid);
    logger.debug(asset.uuid, "Asset deleted");
    return res
      .status(200)
      .json(createSuccessResponse({ message: "Asset deleted successfully" }));
  } catch (error) {
    logger.error(error, "Error deleting asset");
    return next({ status: 500, message: "Internal server error" });
  }
};
