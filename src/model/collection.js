const { prisma } = require("./data/prismaClient");
const { collectionInclude, formatCollection } = require("./utils");
const { NotFoundError, ForbiddenError } = require("../lib/error");

async function createCollection(userId, data) {
  const collection = await prisma.collection.create({
    data: { ...data, user: { connect: { userId } } },
    include: collectionInclude(userId),
  });

  return formatCollection(collection);
}

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

async function deleteCollection(userId, collectionId) {
  // Find asset to check ownership
  const asset = await prisma.collection.findUnique({ where: { collectionId } });

  if (!asset) {
    throw new NotFoundError();
  }

  if (asset.userId !== userId) {
    throw new ForbiddenError();
  }

  // Delete asset record
  await prisma.collection.delete({ where: { collectionId } });

  return;
}

module.exports = {
  createCollection,
  getCollection,
  deleteCollection,
};
