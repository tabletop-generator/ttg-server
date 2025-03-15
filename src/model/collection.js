const { z } = require("zod");
const prisma = require("./data/prismaClient");

// Schema for collection validation
const schema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  visibility: z.enum(["public", "private", "unlisted"]),
  assets: z.array(z.string().uuid()).optional(),
});

/**
 * Save a new collection
 * @param {String} userHashedEmail - The hashed email of the user creating the collection
 * @param {Object} collectionData - The collection data to save
 * @returns {Promise<Object>} - The saved collection
 */
async function save(userHashedEmail, collectionData) {
  // Get the user's database id to create the foreign key with the collection
  const user = await prisma.user.findUnique({
    where: { hashedEmail: userHashedEmail },
    select: { id: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Create the collection
  const collection = await prisma.collection.create({
    data: {
      creatorId: user.id,
      name: collectionData.name,
      description: collectionData.description,
      visibility: collectionData.visibility,
      assets: {
        connect: collectionData.assets?.map((uuid) => ({ uuid })),
      },
    },
    include: {
      assets: {
        select: {
          uuid: true,
        },
      },
      user: {
        select: {
          hashedEmail: true,
        },
      },
    },
  });

  // Format the response to match the API spec
  return {
    id: collection.id,
    ownerId: collection.user.hashedEmail,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    name: collection.name,
    description: collection.description,
    visibility: collection.visibility,
    assets: collection.assets.map((asset) => asset.uuid),
  };
}

/**
 * Get a collection by ID with access control
 * @param {Number} id - The collection ID
 * @param {Number} [currentUserId] - Optional current user's database ID
 * @returns {Promise<Object>} - The collection data
 * @throws {Error} - Forbidden error if unauthorized
 */
async function get(id, currentUserId) {
  // Get collection from database
  const collection = await prisma.collection.findUniqueOrThrow({
    where: { id: Number(id) },
    include: {
      assets: {
        select: {
          uuid: true,
        },
      },
      user: {
        select: {
          hashedEmail: true,
        },
      },
    },
  });

  // Authorization check
  if (
    collection.visibility !== "public" &&
    collection.creatorId !== currentUserId
  ) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  // Format the response to match the API spec
  return {
    id: collection.id,
    ownerId: collection.user.hashedEmail,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    name: collection.name,
    description: collection.description,
    visibility: collection.visibility,
    assets: collection.assets.map((asset) => asset.uuid),
  };
}

module.exports = {
  schema,
  save,
  get,
};
