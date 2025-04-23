const ai = require("ai");
const { groq } = require("@ai-sdk/groq");
const prompts = require("./prompts");

/**
 * Generates a description for the asset.
 * @param {String} type
 * @param {Object} data
 * @returns String
 */
async function generateDescription(name, type, data) {
  const prompt = prompts[type].buildDescPrompt(name, data);

  const { text } = await ai.generateText({
    model: groq(process.env.GROQ_MODEL),
    messages: prompt,
  });

  return text;
}

module.exports = generateDescription;
