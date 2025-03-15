const logger = require("../../../logger");
const { createSuccessResponse } = require("../../../response");
const { get: getUser } = require("../../../model/user");
const { listCollection } = require("../../../model/collection");
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
  let query;
  try {
    query = listCollectionsSchema.parse({ query: req.query }).query;
  } catch (error) {
    logger.warn({ error }, "Invalid query parameters");
    return res.status(400).json({
      status: "error",
      error: {
        code: 400,
        message: "Invalid query parameters",
        details: error.errors.map((e) => e.message),
      },
    });
  }

  const { name, userId, expand } = query;
  const expandCollections = expand === true;
  const where = {};

  if (userId) {
    let user, currentUser;
    try {
      user = await getUser(userId);
      currentUser = await getUser(req.user);
    } catch (error) {
      logger.warn({ error }, "User not found");
      return res.status(404).json({
        status: "error",
        error: { code: 404, message: "User not found" },
      });
    }
    const isCurrentUser = currentUser.hashedEmail === userId;
    where.creatorId = user.id;
    where.visibility = isCurrentUser
      ? { in: ["public", "private", "unlisted"] }
      : "public";
  } else {
    where.visibility = "public";
  }

  if (name) {
    where.name = { contains: name, mode: "insensitive" };
  }

  let collections;
  try {
    collections = await listCollection(where, expandCollections);
  } catch (error) {
    logger.error({ error }, "Error listing collections");
    return next({ status: 500, message: "Internal server error" });
  }

  logger.info("Collections listed successfully");
  return res.status(200).json(createSuccessResponse({ collections }));
};
