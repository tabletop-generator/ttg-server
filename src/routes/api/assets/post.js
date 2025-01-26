const asset = require("../../../model/asset");
const logger = require("../../../logger");
const generate = require("../../../generator");

/**
 * Generate and save an asset
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/assets`,
  );

  // Validate request format
  try {
    asset.schema.parse(req.body);
  } catch (error) {
    logger.debug({ error }, "invalid request format");
    error.status = 400;
    error.message = "invalid request format";
    return next(error);
  }

  // Generate asset description and image
  let description, image, mimeType;
  try {
    ({ description, image, mimeType } = await generate(
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
    newAsset = await asset.save(
      req.user,
      description,
      image,
      req.body,
      mimeType,
    );
  } catch (error) {
    return next(error);
  }

  // Return asset metadata
  const locationURL = new URL(
    `/v1/assets/${newAsset.uuid}`,
    process.env?.API_URL || `https://${req.headers?.host}`,
  );

  logger.debug(
    { locationURL },
    `constructed URL for Location header for new asset`,
  );

  return res.status(201).set("Location", locationURL).json(newAsset);
};
