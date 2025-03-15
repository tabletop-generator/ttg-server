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
  try {
    const { query } = listCollectionsSchema.parse({
      query: req.query,
    });
    const { name, userId, expand } = query;

    const expandCollections = expand === true;
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

    const responseData = await listCollection(where, expandCollections);

    return res
      .status(200)
      .json(createSuccessResponse({ collections: responseData }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: "Invalid query parameters",
          details: error.errors.map((e) => e.message),
        },
      });
    }
    logger.error(error, "Error fetching collections");
    return next({ status: 500, message: "Internal server error" });
  }
};
