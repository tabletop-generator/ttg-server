const { prisma } = require("./data/prismaClient");
const {
  assetInclude,
  formatAsset,
  renewAssetImageUrlIfExpired,
  canViewAsset,
} = require("./asset");
const { NotFoundError, ForbiddenError } = require("../lib/error");

function collectionInclude(userId) {
  return {
    _count: { select: { assets: true } },
    assets: {
      include: assetInclude(userId),
      where: { ...canViewAsset(userId) },
    },
  };
}

async function formatCollection(collection) {
  return {
    collectionId: collection.collectionId,
    userId: collection.userId,
    name: collection.name,
    description: collection.description,
    visibility: collection.visibility,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    assetCount: collection._count.assets,
    assets: await Promise.all(
      collection.assets.map(async (asset) => {
        asset = await renewAssetImageUrlIfExpired(asset);
        return formatAsset(asset);
      }),
    ),
  };
}

async function createCollection(userId, data) {
  const collection = await prisma.collection.create({
    data: {
      ...data,
      user: {
        connect: { userId },
      },
    },
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

module.exports = {
  createCollection,
  getCollection,
};
