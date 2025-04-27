const { prisma } = require("../../../model/data/prismaClient");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Get the current user
 */

module.exports = async (req, res, next) => {
  logger.debug({ user: req.user }, `received request: GET /v1/users/me`);

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { userId: req.user },
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
