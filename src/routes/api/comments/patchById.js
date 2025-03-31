const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const prisma = require("../../../model/data/prismaClient");
const { z } = require("zod");

/**
 * Update a comment by its id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.commentId },
    `received request: PATCH /v1/comments/:commentId`,
  );

  const commentId = req.params.commentId;

  // Validate request body schema
  const schema = z.object({
    body: z.string().min(1),
  });

  try {
    schema.parse(req.body);
  } catch (error) {
    logger.debug({ error }, "Invalid comment data");
    return next({
      status: 400,
      message: "Invalid comment data",
    });
  }

  try {
    // Find the comment to update
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
      include: {
        user: {
          select: {
            hashedEmail: true,
          },
        },
      },
    });

    // Check if comment exists
    if (!comment) {
      logger.debug({ commentId }, "Comment not found");
      return next({ status: 404, message: "Comment not found" });
    }

    // Verify user permission (only comment author can edit)
    if (comment.user.hashedEmail !== req.user) {
      logger.debug(
        { commentId, user: req.user, commentUser: comment.user.hashedEmail },
        "User not authorized to update comment",
      );
      return next({ status: 403, message: "Forbidden" });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId, 10) },
      data: {
        body: req.body.body,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            hashedEmail: true,
            displayName: true,
          },
        },
        asset: {
          select: {
            uuid: true,
          },
        },
      },
    });

    // Format the response
    const formattedComment = {
      id: updatedComment.id,
      assetId: updatedComment.asset.uuid,
      userId: updatedComment.user.hashedEmail,
      userName: updatedComment.user.displayName,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
      body: updatedComment.body,
    };

    return res
      .status(200)
      .json(createSuccessResponse({ comment: formattedComment }));
  } catch (error) {
    logger.error({ error, commentId }, "Error updating comment");
    return next({ status: 500, message: "Internal server error" });
  }
};
