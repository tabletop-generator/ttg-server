const { saveAsset } = require("../../../model/asset");
const logger = require("../../../lib/logger");
const generate = require("../../../lib/generator");

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
    ({ description, image, mimeType } = await generate(
      req.body.name,
      req.body.type,
      req.body.data,
    ));
    logger.debug({ description, mimeType }, "generated asset");
  } catch (error) {
    return next(error);
  }

  // Save asset image and metadata
  let newAsset;
  try {
    newAsset = await saveAsset(
      req.user,
      description,
      image,
      req.body,
      mimeType,
    );
  } catch (error) {
    return next(error);
  }

  const locationURL = new URL(
    `/v1/assets/${newAsset.id}`,
    process.env?.API_URL || `https://${req.headers?.host}`,
  );

  logger.debug(
    { locationURL },
    `constructed URL for Location header for new asset`,
  );

  // Return asset metadata
  return res.status(201).set("Location", locationURL).json({ asset: newAsset });
};
