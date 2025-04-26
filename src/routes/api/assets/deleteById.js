const { createHttpError } = require("../../../lib/error");
const logger = require("../../../lib/logger");
const prisma = require("../../../model/data/prismaClient");

/**
 * Delete an asset by it's id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, assetIdParam: req.params.assetId },
    `received request: DELETE /v1/assets/:assetId`,
  );

  // Find asset to check ownership
  let assetToDelete;
  try {
    assetToDelete = await prisma.asset.findUnique({
      where: { assetId: req.params.assetId },
    });
  } catch (error) {
    logger.error({ error }, "error finding asset");
    return next(createHttpError(500, "Error finding asset"));
  }

  if (!assetToDelete) {
    return next(createHttpError(404, "Not Found"));
  }

  if (assetToDelete.creatorId !== req.user) {
    return next(createHttpError(403, "Forbidden"));
  }

  // Perform a cascading delete transaction on comments and assets
  const deleteComments = prisma.comment.deleteMany({
    where: { assetId: req.params.assetId },
  });

  const deleteAsset = prisma.asset.delete({
    where: { assetId: req.params.assetId },
  });

  try {
    await prisma.$transaction([deleteComments, deleteAsset]);
  } catch (error) {
    logger.error({ error }, "error deleting asset");
    return next(createHttpError(500, "Error deleting asset"));
  }

  return res.status(204).send();
};
