const logger = require("../../../logger");
const { z } = require("zod");
const prisma = require("../../../model/data/prismaClient");
const { createSuccessResponse } = require("../../../response");
const {
  uploadDataToS3,
  createPresignedUrl,
} = require("../../../model/data/aws/");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const patchSchema = z
  .object({
    displayName: z.string().min(1).max(50).optional(),
    profileBio: z.string().max(500).nullable().optional(),
  })
  .strict();

/**
 * Update the current user
 */
module.exports = [
  upload.single("profilePicture"),
  async (req, res, next) => {
    logger.debug(
      { user: req.user, body: req.body, file: !!req.file },
      `received request: PATCH /v1/users`,
    );

    try {
      patchSchema.parse(req.body);
    } catch (error) {
      logger.debug({ error }, "invalid request body");
      error.status = 400;
      error.message = "Invalid request format";
      return next(error);
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { hashedEmail: req.user },
      });
    } catch (error) {
      logger.error({ error }, "Error fetching user");
      return next({ status: 500, message: "Internal server error" });
    }

    if (!user) {
      logger.debug("User not found");
      return next({ status: 404, message: "User not found" });
    }

    let profilePictureUrl = user.profilePictureUrl;
    let profilePictureUrlExpiry = user.profilePictureUrlExpiry;

    if (req.file) {
      try {
        const fileBuffer = req.file.buffer;
        const fileExtension = req.file.originalname.split(".").pop();
        const s3Key = `profile-pictures/${user.id}-${Date.now()}.${fileExtension}`;

        await uploadDataToS3(s3Key, fileBuffer, req.file.mimetype);
        const { url, urlExpiry } = await createPresignedUrl(s3Key);

        profilePictureUrl = url;
        profilePictureUrlExpiry = urlExpiry;
      } catch (error) {
        logger.error({ error }, "Error uploading image to S3");
        return next({ status: 500, message: "Failed to upload image" });
      }
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: req.body.displayName,
          profileBio: req.body.profileBio,
          profilePictureUrl,
          profilePictureUrlExpiry,
        },
      });

      return res.status(200).json(createSuccessResponse({ user: updatedUser }));
    } catch (error) {
      logger.error({ error }, "Error updating user");
      return next({ status: 500, message: "Internal server error" });
    }
  },
];
