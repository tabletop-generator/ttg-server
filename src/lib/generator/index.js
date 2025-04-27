const { generateImage } = require("./generateImage");
const { generateDescription } = require("./generateDescription");

async function generateAsset(name, type, data) {
  const description = await generateDescription(name, type, data);
  const { image, mimeType } = await generateImage(type, description);

  return { description, image, mimeType };
}

module.exports = { generateAsset };
