const { prisma } = require("./data/prismaClient");
const {
  collectionInclude,
  formatCollection,
  canViewResource,
} = require("./utils");
const { NotFoundError, ForbiddenError } = require("../lib/error");

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {Object} data
 * @returns {Object}
 */
async function createCollection(userId, { name, description, visibility }) {
  const collection = await prisma.collection.create({
    data: { name, description, visibility, user: { connect: { userId } } },
    include: collectionInclude(userId),
  });

  return formatCollection(collection);
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} collectionId
 * @returns {Object}
 */
async function getCollection(userId, collectionId) {
  const collection = await prisma.collection.findUnique({
    where: { collectionId },
    include: collectionInclude(userId),
  });

  if (!collection) {
    throw new NotFoundError();
  }

  if (collection.userId !== userId && collection.visibility === "private") {
    throw new ForbiddenError();
  }

  return await formatCollection(collection);
}

/**
 *
 * @param {import("node:crypto").UUID} currentUserId
 * @param {Object} query
 * @returns {Object}
 */
async function listCollections(currentUserId, { limit, offset, userId }) {
  const collections = await prisma.collection.findMany({
    where: {
      ...canViewResource(currentUserId),
      userId,
    },
    skip: parseInt(offset ?? 0, 10),
    take: Math.min(parseInt(limit ?? 20, 10), 100),
    orderBy: { createdAt: "desc" },
    include: collectionInclude(currentUserId),
  });

  return await Promise.all(
    collections.map(async (collection) => {
      return formatCollection(collection);
    }),
  );
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} collectionId
 * @param {Object} data
 * @returns {Object}
 */
async function updateCollection(
  userId,
  collectionId,
  { name, description, visibility },
) {
  // Find collection to check ownership
  let collection = await prisma.collection.findUnique({
    where: { collectionId },
  });

  if (!collection) {
    throw new NotFoundError();
  }

  if (collection.userId !== userId) {
    throw new ForbiddenError();
  }

  collection = await prisma.collection.update({
    where: { collectionId },
    data: { name, description, visibility },
    include: collectionInclude(userId, true),
  });

  return formatCollection(collection);
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} collectionId
 * @param {import("node:crypto").UUID[]} assetIds
 */
async function addAssetsToCollection(userId, collectionId, assetIds) {
  // Verify the collection exists and belongs to the user
  let collection = await prisma.collection.findUnique({
    where: { collectionId },
  });

  if (!collection) {
    throw new NotFoundError();
  }

  if (collection.userId !== userId) {
    throw new ForbiddenError();
  }

  // Validate each asset belongs to user or is public
  const assets = await prisma.asset.findMany({
    where: { assetId: { in: assetIds }, ...canViewResource(userId) },
    select: { assetId: true },
  });

  const validAssetIds = new Set(assets.map((a) => a.assetId));
  const missing = assetIds.filter((id) => !validAssetIds.has(id));
  if (missing.length > 0) throw new ForbiddenError();

  collection = await prisma.collection.update({
    data: { assets: { connect: assetIds.map((assetId) => ({ assetId })) } },
    where: { collectionId },
    include: collectionInclude(userId),
  });

  return formatCollection(collection);
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} collectionId
 * @param {import("node:crypto").UUID[]} assetIds
 */
async function removeAssetsFromCollection(userId, collectionId, assetIds) {
  // Verify the collection exists and belongs to the user
  let collection = await prisma.collection.findUnique({
    where: { collectionId },
  });

  if (!collection) {
    throw new NotFoundError();
  }

  if (collection.userId !== userId) {
    throw new ForbiddenError();
  }

  // Validate each asset belongs to user or is public
  const assets = await prisma.asset.findMany({
    where: { assetId: { in: assetIds }, ...canViewResource(userId) },
    select: { assetId: true },
  });

  const validAssetIds = new Set(assets.map((a) => a.assetId));
  const missing = assetIds.filter((id) => !validAssetIds.has(id));
  if (missing.length > 0) throw new ForbiddenError();

  collection = await prisma.collection.update({
    data: { assets: { disconnect: assetIds.map((assetId) => ({ assetId })) } },
    where: { collectionId },
    include: collectionInclude(userId),
  });

  return formatCollection(collection);
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} collectionId
 * @returns {Object}
 */
async function deleteCollection(userId, collectionId) {
  // Find collection to check ownership
  const collection = await prisma.collection.findUnique({
    where: { collectionId },
  });

  if (!collection) {
    throw new NotFoundError();
  }

  if (collection.userId !== userId) {
    throw new ForbiddenError();
  }

  // Delete collection record
  await prisma.collection.delete({ where: { collectionId } });

  return;
}

module.exports = {
  createCollection,
  getCollection,
  listCollections,
  updateCollection,
  addAssetsToCollection,
  removeAssetsFromCollection,
  deleteCollection,
};
