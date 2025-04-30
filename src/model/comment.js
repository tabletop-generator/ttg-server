const { NotFoundError, ForbiddenError } = require("../lib/error");
const { prisma } = require("./data/prismaClient");
const { commentInclude, formatComment } = require("./utils");

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} assetId
 * @param {Object} data
 * @returns {Object}
 */
async function createComment(userId, assetId, { body }) {
  // Check asset existence and permissions
  const asset = await prisma.asset.findUnique({ where: { assetId } });

  if (!asset) {
    throw new NotFoundError();
  }

  if (asset.userId !== userId && asset.visibility !== "public") {
    throw new ForbiddenError();
  }

  const comment = await prisma.comment.create({
    data: {
      body,
      user: { connect: { userId } },
      asset: { connect: { assetId } },
    },
    include: commentInclude(),
  });

  return formatComment(comment);
}

async function listComments(userId, assetId, { limit, offset }) {
  // Check asset existence and permissions
  const asset = await prisma.asset.findUnique({ where: { assetId } });

  if (!asset) {
    throw new NotFoundError();
  }

  if (asset.userId !== userId && asset.visibility !== "public") {
    throw new ForbiddenError();
  }

  const comments = await prisma.comment.findMany({
    where: { assetId },
    skip: parseInt(offset ?? 0, 10),
    take: Math.min(parseInt(limit ?? 20, 10), 100),
    orderBy: { createdAt: "desc" },
    include: commentInclude(userId),
  });

  return await Promise.all(
    comments.map(async (comment) => {
      return formatComment(comment);
    }),
  );
}

async function updateComment(userId, commentId, { body }) {
  // Find comment to check ownership
  let comment = await prisma.comment.findUnique({
    where: { commentId },
  });

  if (!comment) {
    throw new NotFoundError();
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError();
  }

  comment = await prisma.comment.update({
    data: { body },
    where: { commentId },
    include: commentInclude(),
  });

  return formatComment(comment);
}

module.exports = { createComment, listComments, updateComment };
