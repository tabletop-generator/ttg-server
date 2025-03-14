const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const prisma = require("../../../model/data/prismaClient");
const { get: getUser } = require("../../../model/user");
/**
 * Get a list of collections filtered by the query
 */

// eslint-disable-next-line no-unused-vars
module.exports = async (req, res, next) => {
  try {
    const { name, userId, expand } = req.query;
    const expandCollections = expand === "true";
    const where = {};

    if (userId) {
      try {
        const user = await getUser(userId);
        const currentUser = await getUser(req.user);
        const isCurrentUser = currentUser.hashedEmail === userId;

        where.creatorId = user.id;
        where.visibility = isCurrentUser
          ? { in: ["public", "private", "unlisted"] }
          : "public";
      } catch (error) {
        logger.error({ error }, "Error fetching collection");
        return res.status(404).json({
          status: "error",
          error: { code: 404, message: "User not found" },
        });
      }
    } else {
      where.visibility = "public";
    }

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    const collections = await prisma.collection.findMany({
      where,
      select: expandCollections
        ? {
            id: true,
            createdAt: true,
            updatedAt: true,
            visibility: true,
            name: true,
            description: true,
            assets: { select: { id: true } },
            user: { select: { hashedEmail: true } },
          }
        : { id: true },
    });

    const responseData = expandCollections
      ? collections.map((c) => ({
          id: c.id,
          ownerId: c.user.hashedEmail,
          created: c.createdAt,
          updated: c.updatedAt,
          name: c.name,
          visibility: c.visibility,
          assets: c.assets.map((a) => a.id),
        }))
      : collections.map((c) => c.id);

    return res
      .status(200)
      .json(createSuccessResponse({ collections: responseData }));
  } catch (error) {
    logger.error(error, "Error fetching collections");
    return next({ status: 500, message: "Internal server error" });
  }
};
