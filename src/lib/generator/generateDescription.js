const { createWorkersAI } = require("workers-ai-provider");
const ai = require("ai");
const prompts = require("./prompts");

/**
 * Generates a description for the asset.
 * @param {String} type
 * @param {Object} data
 * @returns String
 */
async function generateDescription(name, type, data) {
  const prompt = prompts[type].buildDescPrompt(name, data);

  const workersAi = createWorkersAI({
    accountId: process.env.CF_ACCOUNT_ID,
    apiKey: process.env.CF_WORKERS_AI_API_TOKEN,
  });

  const model = workersAi(process.env.CF_TEXT_GENERATION_MODEL, {
    safePrompt: true,
  });

  const { text } = await ai.generateText({
    model: model,
    messages: prompt,
  });

  return text;
}

module.exports = generateDescription;
