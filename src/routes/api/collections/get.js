const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const { get: getUser } = require("../../../model/user");
const { listCollections } = require("../../../model/collection");
const { z } = require("zod");

const listCollectionsSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    userId: z.string().optional(),
    expand: z
      .string()
      .regex(/^(true|false)$/)
      .optional()
      .transform((val) => val === "true"),
  }),
});

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    "received request: GET /v1/collections",
  );

  let query;
  try {
    query = listCollectionsSchema.parse({ query: req.query }).query;
  } catch (error) {
    logger.warn({ error }, "Invalid query parameters");
    return next({ status: 400, message: "Invalid query parameters" });
  }

  const { name, userId, expand } = query;
  const expandCollections = expand === true;
  const where = {};

  if (userId) {
    try {
      const user = await getUser(userId);
      const isCurrentUser = userId === req.user;
      where.creatorId = user.id;
      where.visibility = isCurrentUser
        ? { in: ["public", "private", "unlisted"] }
        : "public";
    } catch (error) {
      logger.error({ error }, "Error fetching user for collection filtering");
      return next({ status: 404, message: "User not found" });
    }
  } else {
    where.visibility = "public";
  }

  if (name) {
    where.name = { contains: name, mode: "insensitive" };
  }

  try {
    const collections = await listCollections(where, expandCollections);
    logger.info(
      { count: collections.length, query: req.query },
      "Collections retrieved successfully",
    );
    return res.status(200).json(createSuccessResponse({ collections }));
  } catch (error) {
    logger.error(error, "Error fetching collections");
    return next({ status: 500, message: "Internal server error" });
  }
};
