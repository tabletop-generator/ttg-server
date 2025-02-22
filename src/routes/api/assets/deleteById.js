const logger = require("../../../logger");
const validator = require("validator");
const { deleteAsset, get } = require("../../../model/asset");
const { createSuccessResponse } = require("../../../response");
const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;

/**
 * Delete an asset by it's id
 */

// eslint-disable-next-line no-unused-vars
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
    logger.error(error, "Error deleting asset");

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return next({ status: 404, message: "Asset not found" });
    }

    return next({ status: 500, message: "Internal server error" });
  }
  await deleteAsset(asset.uuid);

  logger.debug(asset.uuid, "Asset deleted");
  return res
    .status(200)
    .json(createSuccessResponse({ message: "Asset deleted successfully" }));
};
