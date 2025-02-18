const logger = require("../../../logger");
const validator = require("validator");
const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;
const { get } = require("../../../model/user");
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
    user = await get(userId);
  } catch (error) {
    logger.error({ error }, "Error fetching user");

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return next({ status: 404, message: "User not found" });
    }
    return next({ status: 500, message: "Internal server error" });
  }

  logger.debug({ user }, `found user`);
  return res.status(200).json(createSuccessResponse({ user: user }));
};
