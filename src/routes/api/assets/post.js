const { generateAsset } = require("../../../lib/generator");
const { saveAsset } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Generate and save an asset
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/assets`,
  );

  // Generate asset description and image
  let description, image, mimeType;
  try {
    ({ description, image, mimeType } = await generateAsset(req.body));
    logger.debug(
      { user: req.user, assetName: req.body.name, description, mimeType },
      "asset generated",
    );
  } catch (error) {
    logger.error({ error, message: error.message }, "error generating asset");
    return next(createHttpError(500, "Error generating asset"));
  }

  // Save asset
  let newAsset;
  try {
    newAsset = await saveAsset(
      req.user,
      req.body,
      description,
      image,
      mimeType,
    );
  } catch (error) {
    logger.error({ error, message: error.message }, "error saving asset");
    return next(createHttpError(500, "Error saving asset"));
  }

  // Construct Location header
  const locationURL = new URL(
    `/v1/assets/${newAsset.assetId}`,
    process.env?.API_URL || `https://${req.headers?.host}`,
  );
  logger.debug(
    { locationURL },
    `constructed URL for Location header for new asset`,
  );

  logger.info({ user: req.user, assetId: newAsset.assetId }, "asset created");

  // Return asset metadata
  return res.status(201).set("Location", locationURL).json(newAsset);
};
