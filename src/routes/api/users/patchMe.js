const { prisma } = require("../../../model/data/prismaClient");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Update the current user
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: PATCH /v1/users/me`,
  );

  let user;
  try {
    user = await prisma.user.update({
      data: {
        ...req.body,
      },
      where: { userId: req.user },
    });
  } catch (error) {
    logger.error({ error, message: error.message }, "error updating user");
    return next(createHttpError(500, "Error updating user"));
  }

  logger.info({ user: req.user }, "user updated");

  return res.status(200).json(user);
};
