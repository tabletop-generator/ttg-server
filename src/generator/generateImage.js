const contentType = require("content-type");
const ai = require("ai");
const { groq } = require("@ai-sdk/groq");
const prompts = require("./prompts");
const logger = require("../logger");

/**
 * Generates an image for an asset
 * @param {String} type
 * @param {String} description
 * @returns {Buffer}
 */
async function generateImage(type, description) {
  // Generate a prompt to generate the image
  const promptPrompt = prompts[type].buildImgPromptPrompt(description);

  const { text: prompt } = await ai.generateText({
    model: groq("gemma2-9b-it"),
    messages: promptPrompt,
  });
  logger.debug({ prompt }, "generated asset image prompt");

  // Generate the image
  const response = await fetch(
    `https://gateway.ai.cloudflare.com/v1/${process.env.CF_ACCOUNT_ID}/${process.env.CF_AIG_NAME}/workers-ai/${process.env.CF_TEXT_TO_IMAGE_MODEL}`,
    {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
      headers: {
        "cf-aig-authorization": `Bearer ${process.env.CF_AIG_TOKEN}`,
        Authorization: `Bearer ${process.env.CF_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(response.status);
  }

  const image = Buffer.from(await response.arrayBuffer());
  const mimeType = contentType.parse(response.headers.get("Content-Type")).type;

  return {
    image,
    mimeType,
  };
}

module.exports = generateImage;
