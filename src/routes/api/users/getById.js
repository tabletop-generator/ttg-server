const logger = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");
const prisma = require("../../../model/data/prismaClient");

/**
 * Get a user by their id
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, userIdParam: req.params.userId },
    `received request: GET /v1/users/:userId`,
  );

  let user;

  try {
    user = await prisma.user.findUnique({
      where: { userId: req.params.userId },
    });
  } catch (error) {
    logger.error({ error }, "error finding user");
    return next(createHttpError(500, "Error finding user"));
  }

  if (!user) {
    return next(createHttpError(404, "User not found"));
  }

  return res.status(200).json(user);
};
