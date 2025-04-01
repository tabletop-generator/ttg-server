const { z } = require("zod");
const prisma = require("./data/prismaClient");
const logger = require("../logger");

// Schema for comment validation
const schema = z.object({
  assetId: z.string().uuid(),
  body: z.string().min(1).max(1000),
});

/**
 * Create a comment on an asset
 * @param {String} userHashedEmail - The hashed email of the user creating the comment
 * @param {Object} commentData - The comment data
 * @returns {Promise<Object>} - The created comment
 */
async function create(userHashedEmail, commentData) {
  logger.debug({ userHashedEmail, commentData }, "creating comment");

  // Get the user's database id
  const user = await prisma.user.findUnique({
    where: { hashedEmail: userHashedEmail },
    select: { id: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Get the asset id from UUID
  const asset = await prisma.asset.findUnique({
    where: { uuid: commentData.assetId },
    select: { id: true },
  });

  if (!asset) {
    const error = new Error("Asset not found");
    error.status = 400;
    throw error;
  }

  // Create the comment
  const comment = await prisma.comment.create({
    data: {
      body: commentData.body,
      asset: {
        connect: { id: asset.id },
      },
      user: {
        connect: { id: user.id },
      },
    },
    include: {
      asset: {
        select: {
          uuid: true,
        },
      },
      user: {
        select: {
          hashedEmail: true,
        },
      },
    },
  });

  // Format the response
  return {
    id: comment.id,
    assetId: comment.asset.uuid,
    userId: comment.user.hashedEmail,
    created: comment.createdAt,
    updated: comment.updatedAt,
    body: comment.body,
  };
}

/**
 * Delete a comment by ID
 * @param {String} userHashedEmail - The hashed email of the user attempting to delete
 * @param {Number} commentId - The ID of the comment to delete
 * @returns {Promise<Boolean>} - True if deletion was successful
 */
async function deleteById(userHashedEmail, commentId) {
  logger.debug({ userHashedEmail, commentId }, "deleting comment");

  // Find the comment with its related user and asset/asset owner
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId, 10) },
    include: {
      user: {
        select: {
          hashedEmail: true,
        },
      },
      asset: {
        select: {
          uuid: true,
          user: {
            select: {
              hashedEmail: true,
            },
          },
        },
      },
    },
  });

  // Check if comment exists
  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  // Verify user permission (either comment author or asset owner can delete)
  const isCommentAuthor = comment.user.hashedEmail === userHashedEmail;
  const isAssetOwner = comment.asset.user.hashedEmail === userHashedEmail;

  if (!isCommentAuthor && !isAssetOwner) {
    logger.debug(
      {
        commentId,
        userHashedEmail,
        commentUser: comment.user.hashedEmail,
        assetOwner: comment.asset.user.hashedEmail,
      },
      "User not authorized to delete comment",
    );
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  // Delete the comment
  await prisma.comment.delete({
    where: { id: parseInt(commentId, 10) },
  });

  return true;
}

module.exports = {
  schema,
  create,
  deleteById,
};
