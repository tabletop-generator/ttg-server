const { prisma } = require("./data/prismaClient");
const { assetInclude, formatAsset } = require("./asset");

async function createCollection(userId, data) {
  const collection = await prisma.collection.create({
    data: {
      ...data,
      user: {
        connect: { userId },
      },
    },
    include: {
      _count: { select: { assets: true } },
      assets: { include: assetInclude(userId) },
    },
  });

  return {
    collectionId: collection.collectionId,
    userId: collection.userId,
    name: collection.name,
    description: collection.description,
    visibility: collection.visibility,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    assetCount: collection._count.assets,
    assets: collection.assets.map((asset) => formatAsset(asset)),
  };
}

module.exports = {
  createCollection,
};
