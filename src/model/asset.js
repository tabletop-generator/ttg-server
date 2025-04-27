const { randomUUID } = require("node:crypto");
const {
  uploadDataToS3,
  createPresignedUrl,
  deleteDataFromS3,
} = require("./data/aws");
const { prisma } = require("./data/prismaClient");

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @returns {Object} An object that defines fields to include in Prisma queries
 */
function assetInclude(userId) {
  return {
    user: { select: { userId: true, displayName: true } },
    _count: { select: { AssetLike: true, comments: true } },
    AssetLike: { select: { userId: true }, where: { userId } },
    character: { omit: { assetId: true } },
    location: { omit: { assetId: true } },
    quest: { omit: { assetId: true } },
    map: { omit: { assetId: true } },
  };
}

/**
 *
 * @param {Object} asset
 * @returns {Object} An object in the shape of the expected response from our HTTP REST API
 */
function toAssetDetails(asset) {
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
    isLikedByCurrentUser: asset.AssetLike.length > 0,
    data: asset[asset.assetType],
  };
}

/**
 * If asset image URL is expired or about to expire, create and save a new URL
 * @param {Object} asset
 * @returns {Object}
 */
async function renewAssetImageUrlIfExpired(asset) {
  const BUFFER_WINDOW = 2 * 60 * 1000; // 2 minutes
  const currentTime = new Date().getTime();

  if (asset.imageUrlExpiry.getTime() > currentTime + BUFFER_WINDOW) {
    return asset;
  }

  const key = `${asset.userId}/${asset.assetId}`;
  const { url, urlExpiry } = await createPresignedUrl(key);

  await prisma.asset.update({
    where: {
      assetId: asset.assetId,
    },
    data: {
      imageUrl: url,
      imageUrlExpiry: urlExpiry,
    },
  });

  asset.imageUrl = url;
  asset.imageUrlExpiry = urlExpiry;

  return asset;
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {String} description
 * @param {Buffer} image
 * @param {Object} metadata
 * @param {String} mimeType
 * @throws
 */
async function saveAsset(
  userId,
  description,
  image,
  { name, assetType, visibility, data },
  mimeType,
) {
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
    include: assetInclude(userId),
  });

  return toAssetDetails(asset);
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
    include: assetInclude(userId),
  });

  if (!asset) {
    throw new Error("Not Found");
  }

  if (asset.creatorId !== userId && asset.visibility === "private") {
    throw new Error("Forbidden");
  }

  asset = await renewAssetImageUrlIfExpired(asset);

  return toAssetDetails(asset);
}

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @param {import("node:crypto").UUID} userId
 * @param {String} name
 * @param {String} description
 * @param {String} visibility
 * @throws
 */
async function updateAsset(assetId, userId, { name, description, visibility }) {
  // Find asset to check ownership
  let asset = await prisma.asset.findUnique({
    where: { assetId: assetId },
  });

  if (!asset) {
    throw new Error("Not Found");
  }

  if (asset.creatorId !== userId) {
    throw new Error("Forbidden");
  }

  asset = await prisma.asset.update({
    where: { assetId: assetId },
    data: { name: name, description: description, visibility: visibility },
    include: assetInclude(userId),
  });

  asset = await renewAssetImageUrlIfExpired(asset);

  return toAssetDetails(asset);
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
  await deleteDataFromS3(`${userId}/${assetId}`);

  // Delete asset record
  await prisma.asset.delete({
    where: {
      assetId: assetId,
    },
  });

  return;
}

module.exports = { saveAsset, getAsset, updateAsset, deleteAsset };
