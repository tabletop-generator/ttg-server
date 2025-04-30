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

module.exports = { createComment };
