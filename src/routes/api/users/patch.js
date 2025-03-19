const logger = require("../../../logger");
const { z } = require("zod");
const prisma = require("../../../model/data/prismaClient");
const user = require("../../../model/user");
const { createSuccessResponse } = require("../../../response");

const patchSchema = z
  .object({
    displayName: z.string().min(1).max(50).optional(),
    profileBio: z.string().max(500).nullable().optional(),
  })
  .strict();

/**
 * Update the current user
 */
module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body, file: !!req.file },
    `received request: PATCH /v1/users`,
  );

  try {
    patchSchema.parse(req.body);
  } catch (error) {
    logger.warn({ error }, "invalid request format");
    return next({ status: 400, message: "Invalid request format" });
  }

  if (req.params.userId !== req.user) {
    logger.debug("Forbidden");
    return next({ status: 403, message: "Forbidden" });
  }

  let existingUser;
  try {
    existingUser = await user.get(req.user);
  } catch (error) {
    logger.error({ error }, "Error fetching user");
    return next({ status: 500, message: "Internal server error" });
  }

  if (!existingUser) {
    logger.debug("User not found");
    return next({ status: 404, message: "User not found" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { hashedEmail: existingUser.hashedEmail },
      data: {
        displayName: req.body.displayName,
        profileBio: req.body.profileBio,
      },
    });

    return res.status(200).json(createSuccessResponse({ user: updatedUser }));
  } catch (error) {
    logger.error({ error }, "Error updating user");
    return next({ status: 500, message: "Internal server error" });
  }
};
