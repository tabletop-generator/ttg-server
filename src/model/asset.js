const { randomUUID } = require("node:crypto");
const {
  uploadDataToS3,
  createPresignedUrl,
  deleteDataFromS3,
} = require("./data/aws");
const { prisma } = require("./data/prismaClient");
const { NotFoundError, ForbiddenError } = require("../lib/error");

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {boolean} [includeTypeData=false] Whether to include type-specific data (character, location, quest, map)
 * @returns {Object} An object that defines fields to include in Prisma queries
 */
function assetInclude(userId, includeTypeData = false) {
  return {
    user: { select: { userId: true, displayName: true } },
    _count: { select: { AssetLike: true, comments: true } },
    AssetLike: { select: { userId: true }, where: { userId } },
    character: includeTypeData && { omit: { assetId: true } },
    location: includeTypeData && { omit: { assetId: true } },
    quest: includeTypeData && { omit: { assetId: true } },
    map: includeTypeData && { omit: { assetId: true } },
  };
}

/**
 *
 * @param {Object} asset
 * @param {boolean} [includeTypeData=false] Whether to include type-specific data (character, location, quest, map)
 * @returns {Object} An object in the shape of the expected response from our HTTP REST API
 */
function formatAsset(asset, includeTypeData = false) {
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
    data: includeTypeData && asset[asset.assetType],
  };
}

function canViewAsset(userId) {
  return { OR: [{ userId }, { visibility: "public" }] };
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

  return await prisma.asset.update({
    where: {
      assetId: asset.assetId,
    },
    data: {
      imageUrl: url,
      imageUrlExpiry: urlExpiry,
    },
    include: assetInclude(asset.userId, true),
  });
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
  { name, assetType, visibility, data },
  description,
  image,
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
    include: assetInclude(userId, true),
  });

  return formatAsset(asset, true);
}

/**
 *
 * @param {import("node:crypto").UUID} currentUserId
 * @param {Object} query
 * @param {number}
 */
async function listAssets(
  currentUserId,
  { limit, offset, assetType, collectionId, userId, name, description },
) {
  const assets = await prisma.asset.findMany({
    where: {
      assetType,
      userId,
      name: name && { contains: name, mode: "insensitive" },
      description: description && {
        contains: description,
        mode: "insensitive",
      },
      collections: collectionId && { some: { collectionId: collectionId } },
      ...canViewAsset(userId),
    },
    include: assetInclude(currentUserId),
    skip: parseInt(offset ?? 0, 10),
    take: Math.min(parseInt(limit ?? 20, 10), 100),
    orderBy: { createdAt: "desc" },
  });

  return await Promise.all(
    assets.map(async (asset) => {
      asset = await renewAssetImageUrlIfExpired(asset);
      return formatAsset(asset, true);
    }),
  );
}

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @param {import("node:crypto").UUID} userId
 * @throws
 */
async function getAsset(assetId, userId) {
  let asset = await prisma.asset.findUnique({
    where: { assetId: assetId },
    include: assetInclude(userId, true),
  });

  if (!asset) {
    throw new NotFoundError();
  }

  if (asset.userId !== userId && asset.visibility === "private") {
    throw new ForbiddenError();
  }

  asset = await renewAssetImageUrlIfExpired(asset);

  return formatAsset(asset, true);
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
    throw new NotFoundError();
  }

  if (asset.userId !== userId) {
    throw new ForbiddenError();
  }

  asset = await prisma.asset.update({
    where: { assetId: assetId },
    data: { name: name, description: description, visibility: visibility },
    include: assetInclude(userId, true),
  });

  asset = await renewAssetImageUrlIfExpired(asset);

  return formatAsset(asset, true);
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {import("node:crypto").UUID} assetId
 * @throws
 */
async function deleteAsset(userId, assetId) {
  // Find asset to check ownership
  const asset = await prisma.asset.findUnique({
    where: { assetId: assetId },
  });

  if (!asset) {
    throw new NotFoundError();
  }

  if (asset.userId !== userId) {
    throw new ForbiddenError();
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

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @param {import("node:crypto").UUID} userId
 */
async function toggleAssetLike(assetId, userId) {
  // Find asset to check permissions
  const asset = await prisma.asset.findUnique({
    where: { assetId: assetId },
  });

  if (!asset) {
    throw new NotFoundError();
  }

  if (asset.userId !== userId && asset.visibility === "private") {
    throw new ForbiddenError();
  }

  // Check the current like status
  const existingLike = await prisma.assetLike.findUnique({
    where: { assetId_userId: { assetId: assetId, userId: userId } },
  });

  if (existingLike) {
    // Unlike (delete existing like)
    await prisma.assetLike.delete({
      where: { assetId_userId: { assetId: assetId, userId: userId } },
    });
  } else {
    await prisma.assetLike.create({
      data: { assetId: assetId, userId: userId },
    });
  }

  // Count total likes after toggle
  const likeCount = await prisma.assetLike.count({
    where: { assetId: assetId },
  });

  return {
    assetId: assetId,
    likeCount: likeCount,
    isLikedByCurrentUser: !existingLike, // It's been toggled so it's the opposite
  };
}

module.exports = {
  assetInclude,
  formatAsset,
  renewAssetImageUrlIfExpired,
  canViewAsset,
  saveAsset,
  listAssets,
  getAsset,
  updateAsset,
  deleteAsset,
  toggleAssetLike,
};
