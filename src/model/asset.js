const { randomUUID } = require("node:crypto");
const { z } = require("zod");
const {
  uploadDataToS3,
  createPresignedUrl,
  deleteDataFromS3,
} = require("./data/aws");
const prisma = require("./data/prismaClient");

const baseSchema = z.object({
  name: z.string(),
  type: z.enum(["character", "location", "quest", "map"]),
  visibility: z.enum(["public", "private", "unlisted"]),
});

const characterSchema = z
  .object({
    race: z.enum([
      "human",
      "elf",
      "drow",
      "half_elf",
      "half_orc",
      "halfling",
      "dwarf",
      "gnome",
      "tiefling",
      "githyanki",
      "dragonborn",
    ]),
    class: z.enum([
      "barbarian",
      "bard",
      "cleric",
      "druid",
      "fighter",
      "monk",
      "paladin",
      "ranger",
      "rogue",
      "sorcerer",
      "warlock",
      "wizard",
    ]),
    gender: z.enum(["male", "female", "non_binary", "genderfluid", "agender"]),
    alignment: z.enum([
      "lawful_good",
      "neutral_good",
      "chaotic_good",
      "lawful_neutral",
      "true_neutral",
      "chaotic_neutral",
      "lawful_evil",
      "neutral_evil",
      "chaotic_evil",
    ]),
    abilities: z.string().optional(),
    appearance: z.string().optional(),
    background: z.string().optional(),
    equipment: z.string().optional(),
    motivation: z.string().optional(),
    personality: z.string().optional(),
  })
  .strict();

const fullSchema = baseSchema
  .extend({
    data: z.union([characterSchema]),
  })
  .refine((fullSchema) => {
    switch (fullSchema.type) {
      case "character":
        return characterSchema.safeParse(fullSchema.data).success;
      default:
        break;
    }
  });

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

module.exports.save = saveAsset;
module.exports.get = getAsset;
module.exports.delete = deleteAsset;
module.exports.schema = fullSchema;
