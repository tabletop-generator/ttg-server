const generateImage = require("./generateImage");
const generateDescription = require("./generateDescription");

async function generate(type, data) {
  const description = await generateDescription(type, data);
  const { image, mimeType } = await generateImage(type, description);

  return { description, image, mimeType };
}

module.exports = generate;
