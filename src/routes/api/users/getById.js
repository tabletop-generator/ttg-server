const logger = require("../../../logger");
const validator = require("validator");
const prisma = require("../../../model/data/prismaClient");
const { createSuccessResponse } = require("../../../response");

/**
 * Get a user by their id
 */
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: GET /v1/users/:userId`,
  );

  const userId = req.params.userId;

  if (!validator.isHash(userId, "sha256")) {
    return next({ status: 400, message: "Invalid hash" });
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { hashedEmail: userId },
      include: {
        assets: true,
        collections: true,
        comments: true,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error fetching user");
    error.status = 500;
    error.message = "Internal server error";
    return next(error);
  }

  if (!user) {
    logger.warn("User not found");
    return next({ status: 404, message: "User not found" });
  }

  logger.debug({ user }, `found user`);
  return res.status(200).json(createSuccessResponse({user: user}));
};
