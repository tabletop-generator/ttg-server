const contentType = require("content-type");
const ai = require("ai");
const { createWorkersAI } = require("workers-ai-provider");
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

  const workersAi = createWorkersAI({
    accountId: process.env.CF_ACCOUNT_ID,
    apiKey: process.env.CF_WORKERS_AI_API_TOKEN,
  });

  const model = workersAi(process.env.CF_TEXT_GENERATION_MODEL, {
    safePrompt: true,
  });

  const { text: prompt } = await ai.generateText({
    model: model,
    messages: promptPrompt,
  });
  logger.debug({ prompt }, "generated asset image prompt");

  // Generate the image
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/${process.env.CF_TEXT_TO_IMAGE_MODEL}`,
    {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
      headers: {
        Authorization: `Bearer ${process.env.CF_WORKERS_AI_API_TOKEN}`,
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

module.exports = { generateImage };
