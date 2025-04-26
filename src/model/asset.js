const { randomUUID } = require("node:crypto");
const {
  uploadDataToS3,
  createPresignedUrl,
  deleteDataFromS3,
} = require("./data/aws");
const prisma = require("./data/prismaClient");

/**
 *
 * @param {String} userId
 * @param {String} description
 * @param {Buffer} image
 * @param {Object} metadata
 * @param {String} mimeType
 * @returns {import("@prisma/client").Asset}
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
      [assetType]: {
        omit: {
          assetId: true,
        },
      },
    },
  });

  const like = await prisma.assetLike.findUnique({
    where: {
      assetId_userId: {
        assetId: assetId,
        userId: userId,
      },
    },
    select: {
      assetId: true, // just to fetch minimal data
    },
  });

  const isLikedByCurrentUser = !!like;

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
    isLikedByCurrentUser: isLikedByCurrentUser,
    data: asset[assetType],
  };
}

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @returns {import("@prisma/client").Asset}
 * @throws
 */
async function getAsset(assetId) {
  // Get asset from database
  let asset = await prisma.asset.findUniqueOrThrow({
    where: { id: assetId },
    include: {
      character: true,
      location: true,
      map: true,
      quest: true,
    },
  });

  // If image url is expired or about to expire soon, create and save new url before returning
  // Define a buffer time in milliseconds
  const BUFFER_WINDOW = 2 * 60 * 1000;
  const currentTime = new Date().getTime();

  if (asset.imageUrlExpiry.getTime() <= currentTime + BUFFER_WINDOW) {
    const key = `${asset.user.id}/${asset.id}`;
    const { url, urlExpiry } = await createPresignedUrl(key);

    asset = await prisma.asset.update({
      where: {
        id: asset.id,
      },
      data: {
        imageUrl: url,
        imageUrlExpiry: urlExpiry,
      },
      include: {
        character: true,
        location: true,
        map: true,
        quest: true,
        user: true,
      },
    });
  }

  return asset;
}

/**
 *
 * @param {import("node:crypto").UUID} assetId
 * @returns {import("@prisma/client").Asset}
 * @throws
 */
async function deleteAsset(assetId) {
  // Delete image from object store
  await deleteDataFromS3(assetId);

  // Delete asset record
  return await prisma.asset.delete({
    where: {
      id: assetId,
    },
  });
}

module.exports.saveAsset = saveAsset;
module.exports.getAsset = getAsset;
module.exports.deleteAsset = deleteAsset;
