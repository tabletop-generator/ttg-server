const { prisma } = require("../../../model/data/prismaClient");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Create the current user if they don't already exist
 */

module.exports = async (req, res, next) => {
  logger.debug({ user: req.user }, `received request: POST /v1/users`);

  // Try to find existing user
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        userId: req.user,
      },
    });
  } catch (error) {
    logger.error({ error }, "error finding user");
    return next(createHttpError(500, "Error finding user"));
  }

  // If found, return their record
  if (user) {
    return res.status(200).json(user);
  }

  // If not, create it
  try {
    user = await prisma.user.create({
      data: {
        userId: req.user,
        displayName: `User ${req.user.slice(0, 6)}`,
      },
    });
  } catch (error) {
    logger.error({ error }, "error creating new user");
    return next(createHttpError(500, "Error creating new user"));
  }

  return res.status(201).json(user);
};
