const { randomUUID } = require("node:crypto");
const { z } = require("zod");
const { uploadDataToS3, createPresignedUrl } = require("./data/aws");
const prisma = require("./data/prismaClient");

const baseSchema = z.object({
  type: z.enum(["character", "location", "quest", "map"]),
  visibility: z.enum(["public", "private", "unlisted"]),
});

const characterSchema = z.object({
  name: z.string(),
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
});

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

async function saveAsset(
  userHashedEmail,
  description,
  image,
  metadata,
  mimeType,
) {
  const { type, visibility, data } = metadata;

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

  // Save asset to database based on the type
  let asset;
  switch (metadata.type) {
    case "character":
      asset = await prisma.asset.create({
        data: {
          uuid: assetId,
          creatorId: userId,
          name: data.name,
          type: type,
          visibility: visibility,
          description: description,
          imageUrl: url,
          imageUrlExpiry: urlExpiry,
          character: {
            create: {
              race: data.race,
              class: data.class,
              gender: data.gender,
              alignment: data.alignment,
              appearance: data.appearance,
              abilities: data.abilities,
              background: data.background,
              equipment: data.equipment,
              motivation: data.motivation,
              personality: data.personality,
            },
          },
        },
      });
      break;

    default:
      break;
  }

  return asset;
}

module.exports.save = saveAsset;
module.exports.schema = fullSchema;
