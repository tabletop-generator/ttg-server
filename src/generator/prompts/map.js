/**
 * Builds a prompt to generate a description
 * @param {Object}
 * @returns {Object[]}
 */
function buildDescPrompt(
  name,
  { type, terrain, scale, pointsOfInterest, customDescription },
) {
  return [
    {
      role: "system",
      content:
        "You are a creative assistant helping to generate detailed " +
        "descriptions of maps for tabletop role-playing games. Provide a " +
        "vivid, engaging description of the map and it's landscape. " +
        "Your descriptions should evoke a sense of adventure and danger, " +
        "incorporating the selected terrain, scale, and notable locations. " +
        "Describe the layout, key landmarks, and any strategic elements that make the battlefield engaging. " +
        "Use descriptive language but avoid excessive length (aim for 100-150 words). " +
        "Adhere to the user's request but don't hesitate to get creative.",
    },
    {
      role: "user",
      content:
        "Name: The Dungeon of Death\n" +
        "Type: Dungeon\n" +
        "Scale: Medium\n" +
        "Terrain: Tunnels, Bridges, Fortifications\n" +
        "Points of Interest: The Broken Gate, The Hanging Chasm, The Obsidian Altar\n" +
        "Custom Description: The map depicts a vast network of twisting tunnels, some carved by ancient hands, others eroded by time.",
    },
    {
      role: "assistant",
      content:
        "This dungeon map showcases a perilous underground labyrinth, its corridors winding through jagged rock and forgotten ruins. " +
        "A bridge, now in ruins, sways precariously over a yawning chasm where the echoes of dripping water seem amplified in the cavernous void. " +
        "Crumbled fortifications line certain chambers, suggesting past sieges and failed defenses. " +
        "At its center, the Obsidian Altar stands ominous, carved with ancient runes that pulse faintly in the dim torchlight. " +
        "Treacherous tunnels weave through the map, their narrow paths forcing adventurers into deadly chokepoints. " +
        "Every step forward is filled with tension, as shadows dance against the walls, hinting at unseen threats waiting in the dark.",
    },
    {
      role: "user",
      content:
        `Name: ${name}\n` +
        `Type: ${type}\n` +
        (scale ? `Scale: ${scale}\n` : "") +
        (terrain ? `Terrain: ${terrain}\n` : "") +
        (pointsOfInterest ? `Points of Interest: ${pointsOfInterest}\n` : "") +
        (customDescription ? `Description: ${customDescription}\n` : ""),
    },
  ];
}

/**
 * Builds a prompt to generate a prompt to generate an image
 * @param {String} description
 * @returns {Object[]}
 */
function buildImgPromptPrompt(description) {
  return [
    {
      role: "system",
      content:
        "The user will provide a detailed description of a fantasy-themed map for a tabletop game, which may include elements like terrain, " +
        "landmarks, geography, and climate. Your task is to convert this detailed description into a **clear " +
        "and concise visual prompt** for an image generation model.\n\n" +
        "Focus on:\n" +
        "- **Key features** such as terrain (e.g., rivers, mountains), landmarks (e.g., castles, towns), and any points of interest (e.g., caves, forests).\n" +
        "- **Geography** like coastlines, islands, valleys, etc.\n" +
        "- **Scale** of the map (e.g., regional, local).\n" +
        +"Condense the description into a **short** prompt (less than 30 words) that focuses on visual and geographical elements, ensuring clarity for the map generation model. " +
        "Remove excessive narrative details and focus on elements that can be clearly represented visually on a map.\n",
    },
    {
      role: "user",
      content:
        "A large world map showing a variety of different regions. The north is dominated by a massive mountain range, with a few scattered towns and villages at the base. To the west is a vast, dark forest that stretches for miles, and a large river runs through it, flowing from the mountains down toward the sea. In the east, there are rolling plains, dotted with a few small towns, and a large desert at the southern edge. In the center, there is a kingdom with a sprawling castle. The map should have a hand-drawn style, with distinct borders for each region and a legend in the corner showing key landmarks and towns.",
    },
    {
      role: "assistant",
      content:
        "Fantasy world map with a northern mountain range, dark forest with river, rolling plains, southern desert, and a central kingdom with a castle. Hand-drawn style, region borders, and a legend with key landmarks and towns.",
    },
    {
      role: "user",
      content: description,
    },
  ];
}

module.exports.buildDescPrompt = buildDescPrompt;
module.exports.buildImgPromptPrompt = buildImgPromptPrompt;
