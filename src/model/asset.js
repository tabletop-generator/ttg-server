const { randomUUID } = require("node:crypto");
const {
  uploadDataToS3,
  createPresignedUrl,
  deleteDataFromS3,
} = require("./data/aws");
const prisma = require("./data/prismaClient");

/**
 *
 * @param {String} userHashedEmail
 * @param {String} description
 * @param {Buffer} image
 * @param {Object} metadata
 * @param {String} mimeType
 * @returns {import("@prisma/client").Asset}
 * @throws
 */
async function saveAsset(
  userHashedEmail,
  description,
  image,
  metadata,
  mimeType,
) {
  const { name, type, visibility, data } = metadata;

  const assetId = randomUUID();
  const key = `${userHashedEmail}/${assetId}`;

  // Upload data to S3 and create a presigned URL
  await uploadDataToS3(key, image, mimeType);
  const { url, urlExpiry } = await createPresignedUrl(key);

  // Get the user's database id to create the foreign key with the asset
  const { id: userId } = await prisma.user.findUniqueOrThrow({
    where: {
      hashedEmail: userHashedEmail,
    },
  });

  // Save asset to database
  return await prisma.asset.create({
    data: {
      uuid: assetId,
      name: name,
      type: type,
      visibility: visibility,
      description: description,
      imageUrl: url,
      imageUrlExpiry: urlExpiry,
      [type]: {
        create: { ...data },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/**
 *
 * @param {import("node:crypto").UUID} assetUuid
 * @param {Boolean} includeUser Whether to include the related user record
 * @returns {import("@prisma/client").Asset}
 * @throws
 */
async function getAsset(assetUuid) {
  // Get asset from database
  let asset = await prisma.asset.findUniqueOrThrow({
    where: { uuid: assetUuid },
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
    const key = `${asset.user.hashedEmail}/${asset.uuid}`;
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
 * @param {import("node:crypto").UUID} assetUuid
 * @returns {import("@prisma/client").Asset}
 * @throws
 */
async function deleteAsset(assetUuid) {
  // Delete image from object store
  await deleteDataFromS3(assetUuid);

  // Delete records for related comments
  await prisma.comment.deleteMany({
    where: {
      asset: {
        is: {
          uuid: assetUuid,
        },
      },
    },
  });

  // Delete asset record
  return await prisma.asset.delete({
    where: {
      uuid: assetUuid,
    },
  });
}

module.exports.saveAsset = saveAsset;
module.exports.getAsset = getAsset;
module.exports.deleteAsset = deleteAsset;
