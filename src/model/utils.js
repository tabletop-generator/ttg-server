const { createPresignedUrl } = require("./data/aws");
const { prisma } = require("./data/prismaClient");

function canViewResource(userId) {
  return { OR: [{ userId }, { visibility: "public" }] };
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @param {boolean} [includeTypeData=false] Whether to include type-specific data (character, location, quest, map)
 * @returns {Object} An object that defines fields to include in Prisma queries
 */
function assetInclude(userId, includeTypeData = false) {
  return {
    user: { select: { displayName: true } },
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
    userId: asset.userId,
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
    data: includeTypeData ? asset[asset.assetType] : undefined,
  };
}

/**
 * If asset image URL is expired or about to expire, create and save a new URL
 * @param {Object} asset
 * @returns {Object}
 */
async function refreshAssetImageUrlIfExpired(asset) {
  const BUFFER_WINDOW = 2 * 60 * 1000; // 2 minutes
  const currentTime = new Date().getTime();

  if (asset.imageUrlExpiry.getTime() > currentTime + BUFFER_WINDOW) {
    return asset;
  }

  const key = `${asset.userId}/${asset.assetId}`;
  const { url: imageUrl, urlExpiry: imageUrlExpiry } =
    await createPresignedUrl(key);

  return await prisma.asset.update({
    where: { assetId: asset.assetId },
    data: { imageUrl, imageUrlExpiry },
    include: assetInclude(asset.userId, true),
  });
}

/**
 *
 * @param {import("node:crypto").UUID} userId
 * @returns {Object}
 */
function collectionInclude(userId) {
  return {
    user: { select: { displayName: true } },
    _count: { select: { assets: true } },
    assets: {
      include: assetInclude(userId),
      where: { ...canViewResource(userId) },
    },
  };
}

async function formatCollection(collection) {
  return {
    collectionId: collection.collectionId,
    userId: collection.userId,
    displayName: collection.user.displayName,
    name: collection.name,
    description: collection.description,
    visibility: collection.visibility,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    assetCount: collection._count.assets,
    assets: await Promise.all(
      collection.assets.map(async (asset) => {
        asset = await refreshAssetImageUrlIfExpired(asset);
        return formatAsset(asset);
      }),
    ),
  };
}

function commentInclude() {
  return { user: { select: { displayName: true } } };
}

function formatComment(comment) {
  return {
    userId: comment.userId,
    displayName: comment.user.displayName,
    commentId: comment.commentId,
    body: comment.body,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

module.exports = {
  canViewResource,
  assetInclude,
  formatAsset,
  refreshAssetImageUrlIfExpired,
  collectionInclude,
  formatCollection,
  commentInclude,
  formatComment,
};
