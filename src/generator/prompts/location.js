/**
 * Builds a prompt to generate a description
 * @param {Object}
 * @returns {Object[]}
 */
function buildDescPrompt(
  name,
  {
    type,
    terrain,
    climate,
    atmosphere,
    inhabitants,
    dangerLevel,
    pointsOfInterest,
    narrativeRole,
    customDescription,
  },
) {
  return [
    {
      role: "system",
      content:
        "You are an assistant designed to generate rich, detailed descriptions of locations for a fantasy-themed tabletop game. The user will provide the **Type** of the location (e.g., village, forest, dungeon), which is required, but the rest of the fields are optional. If additional fields are provided, integrate them naturally into the description." +
        "Consider the following fields to create a coherent and engaging location description:\n" +
        "- Type: The general kind of location (e.g., village, castle, forest, dungeon).\n" +
        "- Terrain: The landscape features (e.g., rocky, swampy, mountainous, flat).\n" +
        "- Climate: The weather and environmental conditions (e.g., temperate, snowy, arid).\n" +
        "- Atmosphere: The overall mood or feeling of the location (e.g., eerie, serene, oppressive).\n" +
        "- Inhabitants: The people or creatures that reside there (e.g., elves, goblins, humans, wild beasts).\n" +
        "- Points of Interest: Notable features or landmarks within the location (e.g., waterfall, ruins, magical artifact).\n" +
        "- Narrative Role: The function of the location within a story (e.g., safe haven, haunted site, key quest location).\n" +
        "- Custom Description: Any additional user-provided details that should be included.\n\n" +
        "Using these details, create a compelling and descriptive paragraph of the location, making sure to incorporate the elements in a natural, coherent manner.\n" +
        "The description should be vivid and immersive, highlighting the most important aspects of the location.\n" +
        "If the user omits details such as terrain, come up with them on your own as necessary to create an interesting description.",
    },
    {
      role: "user",
      content:
        "Name: The Dungeon of Death\n" +
        "Type: Dungeon\n" +
        "Terrain: Underground\n" +
        "Climate: Misty/Foggy\n" +
        "Atmosphere: Haunted\n" +
        "Inhabitants: Undead\n" +
        "Danger Level: High\n" +
        "Points of Interest: Forgotten Crypt, The Weeping Statue, The Bone Pit\n" +
        "Narrative Role: A hidden dungeon where an ancient evil stirs, threatening to awaken and spread across the land.\n" +
        "Custom Description: The air is thick with dampness, and the flickering torchlight barely pierces the suffocating fog. " +
        "Echoes of distant whispers weave through the stone corridors, carried by unseen forces. In the heart of the dungeon lies the Weeping Statue, " +
        "its once-marble face now cracked and streaked with eternal tears. Skeletal remains line the Bone Pit, a grim reminder of those who entered but never left. " +
        "Legends speak of a slumbering entity sealed beneath the crypt, its dreams leaking into reality, corrupting all who dare to disturb its rest.",
    },
    {
      role: "assistant",
      content:
        "Beneath the surface, hidden from the sun’s gaze, this dungeon breathes in quiet malice. Its corridors, carved by forgotten hands, twist like the innards of a beast. " +
        "Fog clings to the stone, swirling around your ankles as though something unseen stirs beneath. The Weeping Statue stands in the central chamber, a sorrowful effigy, " +
        "its cries filling the air with a mournful wail. Beyond lies the Bone Pit, where the remnants of past explorers have been left as a warning. " +
        "Something lingers here, watching, waiting. The deeper you venture, the more the shadows seem to shift, whispering secrets best left unheard.",
    },
    {
      role: "user",
      content:
        `Name: ${name}\n` +
        `Type: ${type}\n` +
        (terrain ? `Terrain: ${terrain}\n` : "") +
        (climate ? `Climate: ${climate}\n` : "") +
        (atmosphere ? `Atmosphere: ${atmosphere}\n` : "") +
        (inhabitants ? `Inhabitants: ${inhabitants}\n` : "") +
        (dangerLevel ? `Danger Level: ${dangerLevel}\n` : "") +
        (pointsOfInterest ? `Points of Interest: ${pointsOfInterest}\n` : "") +
        (narrativeRole ? `Narrative Role: ${narrativeRole}\n` : "") +
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
        "Your task is to convert a location description into a detailed prompt for a text-to-image model. " +
        "Use the provided description and extract key details such as the type, terrain, atmosphere, notable features, and any inhabitants or specific visual elements. " +
        "Make sure the prompt is clear, concise, and captures the essence of the description for the model to generate an image." +
        "Here are some elements you might focus on:\n" +
        "- Type of location (e.g., forest, castle, village)\n" +
        "- Terrain features (e.g., rocky, swampy, mountainous)\n" +
        "- Atmosphere (e.g., eerie, serene, mysterious)\n" +
        "- Inhabitants (e.g., spirits, animals, people)\n" +
        "- Notable features (e.g., waterfalls, ruins, ancient trees)\n" +
        "- Mood or setting (e.g., quiet, chaotic, oppressive)\n" +
        "The resulting prompt should be a detailed description that helps the text-to-image model understand the visual elements clearly, while being concise enough to avoid unnecessary detail.",
    },
    {
      role: "user",
      content:
        "A dark forest covered with thick, twisting trees. The air is thick with mist and there's a constant eerie sound " +
        "of wind whistling through the branches. In the center of the forest stands a massive ancient oak tree, its bark " +
        "dark and gnarled, with roots that seem to stretch endlessly into the earth. A small clearing surrounds the tree, " +
        "and fog drifts around the ground, making the whole scene feel heavy and ominous. Strange, ghostly shapes move in the " +
        "shadows, and the forest seems alive with whispers. The weather is overcast, and the sun barely breaks through the thick " +
        "canopy, casting an eerie, dim light across the scene.",
    },
    {
      role: "assistant",
      content:
        "A dark, rocky forest with dense green trees and jagged rocks scattered across the forest floor. Tall cliffs rise in " +
        "the background, partially covered with moss. A large, ancient tree stands at the center of the scene, its twisted " +
        "branches reaching high into the sky. In the shadows, ghostly figures are barely visible, and large wild beasts roam " +
        "the underbrush. The atmosphere is haunting and mysterious, with soft, misty lighting filtering through the trees.",
    },
    {
      role: "user",
      content: description,
    },
  ];
}

module.exports.buildDescPrompt = buildDescPrompt;
module.exports.buildImgPromptPrompt = buildImgPromptPrompt;
