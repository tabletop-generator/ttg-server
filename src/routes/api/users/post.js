const logger = require("../../../logger");
const prisma = require("../../../model/data/prismaClient");
const { createSuccessResponse } = require("../../../response");

/**
 * Initialize a user record if it doesn't exist
 */

module.exports = async (req, res, next) => {
  logger.debug({ user: req.user }, "received request: POST /v1/users");

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

  // Create URL for Location header for GET /users/:id
  const locationURL = new URL(
    `/v1/users/${req.user}`,
    process.env?.API_URL || `https://${req.headers?.host}`,
  );

  if (existingUser) {
    logger.debug(
      { userId: req.user, existingUser },
      "User record already exists",
    );
    return res
      .status(200)
      .set("Location", locationURL)
      .json(createSuccessResponse({ user: existingUser }));
  }

  // User record doesn't exist, create one
  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        hashedEmail: req.user,
        displayName: `user_${req.user.slice(0, 8)}`, // Default display name using first 8 chars of hash
        profileBio: "", // Empty bio by default
      },
    });
    logger.info({ userId: req.user, newUser }, "Created new user record");
  } catch (err) {
    logger.error({ err }, "Error creating new user");
    return next(err);
  }

  return res
    .status(201)
    .set("Location", locationURL)
    .json(createSuccessResponse({ user: newUser }));
};
