const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const { z } = require("zod");
const prisma = require("../../../model/data/prismaClient");

/**
 * Get comments for an asset using the asset id in the query
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/comments`,
  );

  // Validate assetId query parameter
  const schema = z.object({
    assetId: z.string().uuid(),
  });

  try {
    schema.parse(req.query);
  } catch (error) {
    logger.debug({ error }, "missing or invalid assetId parameter");
    return next({
      status: 400,
      message: "assetId parameter is required and must be a valid UUID",
    });
  }

  const { assetId } = req.query;

  // Check if asset exists
  try {
    const asset = await prisma.asset.findUnique({
      where: { uuid: assetId },
    });

    if (!asset) {
      logger.warn({ assetId }, "Asset not found when fetching comments");
      return next({ status: 404, message: "Asset not found" });
    }

    // Fetch all comments for the asset
    const comments = await prisma.comment.findMany({
      where: { assetId: asset.id },
      include: {
        user: {
          select: {
            hashedEmail: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the comments for response
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      assetId: assetId,
      userId: comment.user.hashedEmail,
      userName: comment.user.displayName,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
    }));

    return res
      .status(200)
      .json(createSuccessResponse({ comments: formattedComments }));
  } catch (error) {
    logger.error({ error, assetId }, "Error fetching comments");
    return next({ status: 500, message: "Internal server error" });
  }
};
