const logger = require("../../../logger");
const prisma = require("../../../prisma");
const { createSuccessResponse } = require("../../../response");

/**
 * Initialize a user record if it doesn't exist
 */
module.exports = async (req, res, next) => {
  try {
    logger.debug({ user: req.user }, "received request: POST /v1/users");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        hashed_email: req.user,
      },
    });

    // If user doesn't exist, create them
    if (!existingUser) {
      await prisma.user.create({
        data: {
          hashed_email: req.user,
          display_name: `user_${req.user.slice(0, 8)}`, // Default display name using first 8 chars of hash
          profile_bio: "", // Empty bio by default
        },
      });
      logger.info({ userId: req.user }, "Created new user record");
    } else {
      logger.debug({ userId: req.user }, "User record already exists");
    }

    // Return success response
    return res.status(201).json(createSuccessResponse());
  } catch (err) {
    logger.error({ err }, "Error initializing user");
    next(err);
  }
};
