const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
        const isCurrentUser = userId === req.user;

        where.creatorId = user.id;

        if (isCurrentUser) {
          where.visibility = { in: ["public", "private", "unlisted"] };
        } else {
          where.visibility = "public";
        }
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
            creatorId: true,
            createdAt: true,
            updatedAt: true,
            visibility: true,
            name: true,
            description: true,
            assets: { select: { id: true } },
          }
        : { id: true },
    });

    const responseData = expandCollections
      ? collections.map((c) => ({
          id: c.id,
          creatorId: c.creatorId,
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
