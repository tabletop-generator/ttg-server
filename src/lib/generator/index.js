const { generateImage } = require("./generateImage");
const { generateDescription } = require("./generateDescription");

async function generateAsset({ name, assetType, data }) {
  const description = await generateDescription(name, assetType, data);
  const { image, mimeType } = await generateImage(assetType, description);

  return { description, image, mimeType };
}

module.exports = { generateAsset };
