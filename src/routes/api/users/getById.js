const logger = require("../../../logger");
const hash = require("../../../hash");
const validator = require("validator");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../../response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Get a user by their id
 */
module.exports = async (req, res) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: GET /v1/users/:userId`,
  );

  const email = req.params.userId;
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json(createErrorResponse(400, "Invalid email format"));
  }

  const userId = hash(email).toString();

  try {
    const user = await prisma.user.findUnique({
      where: { hashedEmail: userId }, //searching prisma for the userId (hashed email)
      select: {
        id: true,
        hashedEmail: true,
        joinDate: true,
        displayName: true,
        profileBio: true,
        profilePictureUrl: true,
        profilePictureUrlExpiry: true,
        assets: true,
        collections: true,
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json(createErrorResponse(404, "User not found"));
    }

    return res.status(200).json(createSuccessResponse(user));
  } catch (error) {
    logger.error(error, "Error fetching user");
    return res
      .status(500)
      .json(createErrorResponse(500, "Internal server error"));
  }
};
