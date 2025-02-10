const logger = require("../../../logger");
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
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json(createErrorResponse(400, "Invalid user ID"));
  }

  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: GET /v1/users/:userId`,
  );

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
