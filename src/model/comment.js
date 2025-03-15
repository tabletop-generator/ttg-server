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

module.exports = {
  schema,
  create,
};
