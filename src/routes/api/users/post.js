const logger = require("../../../logger");
const prisma = require("../../../model/data/prismaClient");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../../response");

/**
 * Initialize a user record if it doesn't exist
 */

module.exports = async (req, res, next) => {
  logger.debug({ user: req.user }, "received request: POST /v1/users");

  if (!req.user) {
    return res.status(401).json(createErrorResponse(401, "not found"));
  }

  // Check if user already exists
  let existingUser;
  try {
    existingUser = await prisma.user.findUnique({
      where: {
        hashedEmail: req.user,
      },
    });
  } catch (err) {
    logger.error({ err }, "Error checking for existing user");
    return next(err);
  }

  // If user doesn't exist, create them
  if (!existingUser) {
    try {
      await prisma.user.create({
        data: {
          hashedEmail: req.user,
          displayName: `user_${req.user.slice(0, 8)}`, // Default display name using first 8 chars of hash
          profileBio: "", // Empty bio by default
        },
      });
      logger.info({ userId: req.user }, "Created new user record");
    } catch (err) {
      logger.error({ err }, "Error creating new user");
      return next(err);
    }
  } else {
    logger.debug({ userId: req.user }, "User record already exists");
  }

  // Return success response
  return res.status(201).json(createSuccessResponse());
};
