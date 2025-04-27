const { randomUUID } = require("node:crypto");
const {
  uploadDataToS3,
  createPresignedUrl,
  deleteDataFromS3,
} = require("./data/aws");
const prisma = require("./data/prismaClient");

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {String} description
 * @param {Buffer} image
 * @param {Object} metadata
 * @param {String} mimeType
 * @throws
 */
async function saveAsset(userId, description, image, metadata, mimeType) {
  const { name, assetType, visibility, data } = metadata;

  const assetId = randomUUID();
  const key = `${userId}/${assetId}`;

  // Upload data to S3 and create a presigned URL
  await uploadDataToS3(key, image, mimeType);
  const { url, urlExpiry } = await createPresignedUrl(key);

  // Save asset to database
  const asset = await prisma.asset.create({
    data: {
      assetId: assetId,
      assetType: assetType,
      name: name,
      visibility: visibility,
      description: description,
      imageUrl: url,
      imageUrlExpiry: urlExpiry,
      [assetType]: {
        create: { ...data },
      },
      user: {
        connect: {
          userId: userId,
        },
      },
    },
    include: {
      user: { select: { userId: true, displayName: true } },
      _count: { select: { AssetLike: true, comments: true } },
      AssetLike: { select: { userId: true }, where: { userId: userId } },
      [assetType]: {
        omit: {
          assetId: true,
        },
      },
    },
  });

  return {
    userId: asset.user.userId,
    displayName: asset.user.displayName,
    assetId: asset.assetId,
    assetType: asset.assetType,
    name: asset.name,
    description: asset.description,
    visibility: asset.visibility,
    imageUrl: asset.imageUrl,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
    likeCount: asset._count.AssetLike,
    commentCount: asset._count.comments,
    isLikedByCurrentUser: !!asset.AssetLike.length > 0,
    data: asset[assetType],
  };
}

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @param {import("node:crypto").UUID} userId
 * @throws
 */
async function getAsset(assetId, userId) {
  // Get asset from database
  let asset = await prisma.asset.findUnique({
    where: { assetId: assetId },
    include: {
      user: { select: { userId: true, displayName: true } },
      _count: { select: { AssetLike: true, comments: true } },
      AssetLike: { select: { userId: true }, where: { userId: userId } },
      character: {
        omit: {
          assetId: true,
        },
      },
      location: {
        omit: {
          assetId: true,
        },
      },
      quest: {
        omit: {
          assetId: true,
        },
      },
      map: {
        omit: {
          assetId: true,
        },
      },
    },
  });

  if (!asset) {
    throw new Error("Not Found");
  }

  if (asset.creatorId !== userId && asset.visibility !== "public") {
    throw new Error("Forbidden");
  }

  // If image url is expired or about to expire soon, create and save new url before returning
  // Define a buffer time in milliseconds
  const BUFFER_WINDOW = 2 * 60 * 1000;
  const currentTime = new Date().getTime();

  if (asset.imageUrlExpiry.getTime() <= currentTime + BUFFER_WINDOW) {
    const key = `${asset.user.id}/${asset.id}`;
    const { url, urlExpiry } = await createPresignedUrl(key);

    asset = await prisma.asset.update({
      where: {
        assetId: assetId,
      },
      data: {
        imageUrl: url,
        imageUrlExpiry: urlExpiry,
      },
      include: {
        user: { select: { userId: true, displayName: true } },
        _count: { select: { AssetLike: true, comments: true } },
        AssetLike: { select: { userId: true }, where: { userId: userId } },
        character: {
          omit: {
            assetId: true,
          },
        },
        location: {
          omit: {
            assetId: true,
          },
        },
        quest: {
          omit: {
            assetId: true,
          },
        },
        map: {
          omit: {
            assetId: true,
          },
        },
      },
    });
  }

  return {
    userId: asset.user.userId,
    displayName: asset.user.displayName,
    assetId: asset.assetId,
    assetType: asset.assetType,
    name: asset.name,
    description: asset.description,
    visibility: asset.visibility,
    imageUrl: asset.imageUrl,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
    likeCount: asset._count.AssetLike,
    commentCount: asset._count.comments,
    isLikedByCurrentUser: !!asset.AssetLike.length > 0,
    data: asset[asset.assetType],
  };
}

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @param {import("node:crypto").UUID} userId
 * @throws
 */
async function deleteAsset(assetId, userId) {
  // Find asset to check ownership
  const asset = await prisma.asset.findUnique({
    where: { assetId: assetId },
  });

  if (!asset) {
    throw new Error("Not Found");
  }

  if (asset.creatorId !== userId) {
    throw new Error("Forbidden");
  }

  // Delete image from object store
  const key = `${userId}/${assetId}`;
  await deleteDataFromS3(key);

  // Delete asset record
  return await prisma.asset.delete({
    where: {
      assetId: assetId,
    },
  });
}

module.exports = { saveAsset, getAsset, deleteAsset };
