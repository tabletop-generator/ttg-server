/**
 * Builds a prompt to generate a D&D quest description.
 * @param {String} name
 * @param {Object}
 * @returns {Object[]}
 */
function buildDescPrompt(
  name,
  {
    type,
    tone,
    location,
    complexity,
    objective,
    antagonist,
    notableNpcs,
    hasCombat,
    hasPuzzles,
    hasSkillChallenges,
    hasDilemmas,
    customDescription,
  },
) {
  return [
    {
      role: "system",
      content:
        "You are a creative assistant specializing in generating detailed " +
        "quests for tabletop role-playing games, particularly Dungeons & Dragons. " +
        "Provide a structured, immersive quest outline with vivid descriptions, " +
        "memorable NPCs, and engaging challenges. The response should be formatted " +
        "clearly with appropriate section headings. " +
        "Use descriptive language, avoid excessive length, and ensure the quest " +
        "fits the specified tone, location, and narrative elements. Expand on the user's input " +
        "to create a fleshed out, detailed quest.",
    },
    {
      role: "user",
      content:
        "Name: The Curse of Black Hollow" +
        "Type: Investigation" +
        "Tone: eerie" +
        "Complexity: Complex" +
        "Objective: Investigate the disappearance of a young girl" +
        "Location: Black Hollow, a mist-covered town on the edge of a cursed forest." +
        "Antagonist: None" +
        "Notable NPCs: Elder Raleth, the quest giver" +
        "Has Combat: No" +
        "Has Puzzles: Yes" +
        "Has Skill Challenges: Yes" +
        "Has Dilemmas: Yes" +
        "Description: A young girl vanished near the ruins last night.",
    },
    {
      role: "assistant",
      content:
        "## The Curse of Black Hollow\n" +
        "A dense fog rolls over the streets of Black Hollow as villagers gather around Elder Raleth’s fire. " +
        "Whispers of the vanished girl send shivers down spines, and all eyes turn to the adventurers. " +
        "In the heart of the ancient ruins, something stirs… \n\n" +
        "Players must uncover the truth behind the disappearances, facing both the horrors of the night " +
        "and the town’s dark history. As they piece together clues, they will find themselves at the heart " +
        "of a centuries-old curse, with the power to break or doom Black Hollow forever.\n\n" +
        "Quest Type: Investigation\n" +
        "Motivation: Mystery & Curiosity\n" +
        "Urgency: Pressing Matter\n" +
        "Atmosphere: Eerie and Unsettling\n" +
        "Location: Black Hollow, a remote, mist-covered town at the edge of a cursed forest." +
        "The town is small, with rickety homes and abandoned roads. A thick fog lingers constantly, " +
        "muffling sounds and hiding eerie shapes in the distance.\n\n" +
        "Quest Giver: Elder Raleth, a frail and weary old seer, approaches the adventurers with desperation in his voice. " +
        "His cloudy eyes seem to pierce through the mist as he pleads for help, claiming that a dark force has awakened once more.\n\n" +
        "Inciting Incident: A young girl, Liora, vanished last night after wandering too close to the ruined chapel deep in the woods. " +
        "Whispers among the villagers suggest the curse of Black Hollow has returned.\n\n" +
        "Quest Overview: The players must investigate the mysterious disappearances plaguing the town. " +
        "They will uncover ancient secrets, face supernatural forces, and ultimately determine whether the curse can be broken—or if Black Hollow is doomed to suffer once more. " +
        "The party will encounter fearful villagers, cryptic symbols, and eerie visions as they navigate the mist-covered ruins. " +
        "A dark force lurks in the shadows, waiting for those who dare to uncover its truth.\n\n" +
        "Encounters & Challenges:\n\n" +
        "Combat: There are no traditional combat encounters, but players may face spectral manifestations of past victims—illusions that whisper their final moments. " +
        "A wrong step could lead them into the hands of something far worse.\n" +
        "Puzzles: The Sealed Altar - Inside the ruined chapel, a stone altar is inscribed with runes that must be deciphered to unlock the hidden passage below. " +
        "The text shifts and reforms as players attempt to make sense of it.\n" +
        "The Lantern of Truth - A cursed lantern flickers erratically, revealing only certain elements of the chapel when lit. " +
        "Players must use it strategically to reveal hidden pathways.\n\n" +
        "Skill Challenges:\n\n " +
        "Navigating the Mist - The deeper the players go into the forest, the denser the mist becomes. " +
        "A failed Survival check may cause them to become lost, forcing them to retrace their steps.\n" +
        "Convincing the Villagers - Many villagers are too frightened to speak.\n" +
        "A successful Persuasion or Intimidation check may reveal crucial details about past disappearances. " +
        "Resisting the Curse - Throughout the adventure, players must pass Wisdom Saving Throws to resist the creeping influence of the curse, which attempts to pull them into the spectral realm.\n\n" +
        "Dilemmas & Choices: The Source of the Curse - Deep within the ruins, the players will find the true source of the town’s torment—an ancient entity bound by the very magic keeping Black Hollow intact. " +
        "Destroying it will break the curse, but may unleash something even worse. " +
        "Leaving it undisturbed means the town’s suffering will continue, but the greater evil remains sealed.\n\n" +
        "Conclusion & Rewards: If the players destroy the entity, the mist clears, the disappearances stop, and the town slowly rebuilds—but the players may have unleashed a darker force unknowingly. " +
        "If they leave the curse intact, Black Hollow remains a place of whispers and terror, and the villagers continue to live in fear, but the world beyond remains safe. " +
        "Potential Rewards: A rare artifact tied to the curse (a cursed lantern, a shadow-infused weapon, etc.). " +
        "The respect (or fear) of Black Hollow’s people. " +
        "Knowledge of ancient magic that could be used elsewhere. " +
        "The true impact of their choices may not be known until much later in their journey...",
    },
    {
      role: "user",
      content:
        `Name: ${name}\n` +
        `Type: ${type}\n` +
        (tone ? `Tone: ${tone}\n` : "") +
        (location ? `Location: ${location}\n` : "") +
        (complexity ? `Complexity: ${complexity}\n` : "") +
        (objective ? `Objective: ${objective}\n` : "") +
        (antagonist ? `Antagonist: ${antagonist}\n` : "") +
        (notableNpcs ? `Notable NPCs: ${notableNpcs}\n` : "") +
        `Has Combat: ${hasCombat ? "Yes" : "No"}\n` +
        `Has Puzzles: ${hasPuzzles ? "Yes" : "No"}\n` +
        `Has Skill Challenges: ${hasSkillChallenges ? "Yes" : "No"}\n` +
        `Has Moral Dilemmas: ${hasDilemmas ? "Yes" : "No"}\n` +
        (customDescription ? `Description: ${customDescription}\n` : ""),
    },
  ];
}

/**
 * Builds a prompt to generate a visual prompt for a quest image.
 * @param {String} description
 * @param {String} location
 * @param {String} atmosphere
 * @returns {Object[]}
 */
function buildImgPromptPrompt(description) {
  return [
    {
      role: "system",
      content:
        "You are a creative assistant specializing in translating descriptive " +
        "text into visual prompts for text-to-image models. Your task is to " +
        "condense a detailed quest description into a clear, concise visual prompt " +
        "that captures the setting, atmosphere, and key elements of the scene. " +
        "Focus strictly on visual and environmental details, avoiding abstract concepts, " +
        "game mechanics, or non-visual storytelling elements. " +
        "Highlight key aspects such as the location, lighting, mood, terrain, and important structures.",
    },
    {
      role: "user",
      content:
        "## The Curse of Black Hollow\n" +
        "A dense fog rolls over the streets of Black Hollow as villagers gather around Elder Raleth’s fire. " +
        "Whispers of the vanished girl send shivers down spines, and all eyes turn to the adventurers. " +
        "In the heart of the ancient ruins, something stirs… \n\n" +
        "Players must uncover the truth behind the disappearances, facing both the horrors of the night " +
        "and the town’s dark history. As they piece together clues, they will find themselves at the heart " +
        "of a centuries-old curse, with the power to break or doom Black Hollow forever.\n\n" +
        "Quest Type: Investigation\n" +
        "Motivation: Mystery & Curiosity\n" +
        "Urgency: Pressing Matter\n" +
        "Atmosphere: Eerie and Unsettling\n" +
        "Location: Black Hollow, a remote, mist-covered town at the edge of a cursed forest." +
        "The town is small, with rickety homes and abandoned roads. A thick fog lingers constantly, " +
        "muffling sounds and hiding eerie shapes in the distance.\n\n" +
        "Quest Giver: Elder Raleth, a frail and weary old seer, approaches the adventurers with desperation in his voice. " +
        "His cloudy eyes seem to pierce through the mist as he pleads for help, claiming that a dark force has awakened once more.\n\n" +
        "Inciting Incident: A young girl, Liora, vanished last night after wandering too close to the ruined chapel deep in the woods. " +
        "Whispers among the villagers suggest the curse of Black Hollow has returned.\n\n" +
        "Quest Overview: The players must investigate the mysterious disappearances plaguing the town. " +
        "They will uncover ancient secrets, face supernatural forces, and ultimately determine whether the curse can be broken—or if Black Hollow is doomed to suffer once more. " +
        "The party will encounter fearful villagers, cryptic symbols, and eerie visions as they navigate the mist-covered ruins. " +
        "A dark force lurks in the shadows, waiting for those who dare to uncover its truth.\n\n" +
        "Encounters & Challenges:\n\n" +
        "Combat: There are no traditional combat encounters, but players may face spectral manifestations of past victims—illusions that whisper their final moments. " +
        "A wrong step could lead them into the hands of something far worse.\n" +
        "Puzzles: The Sealed Altar - Inside the ruined chapel, a stone altar is inscribed with runes that must be deciphered to unlock the hidden passage below. " +
        "The text shifts and reforms as players attempt to make sense of it.\n" +
        "The Lantern of Truth - A cursed lantern flickers erratically, revealing only certain elements of the chapel when lit. " +
        "Players must use it strategically to reveal hidden pathways.\n\n" +
        "Skill Challenges:\n\n " +
        "Navigating the Mist - The deeper the players go into the forest, the denser the mist becomes. " +
        "A failed Survival check may cause them to become lost, forcing them to retrace their steps.\n" +
        "Convincing the Villagers - Many villagers are too frightened to speak.\n" +
        "A successful Persuasion or Intimidation check may reveal crucial details about past disappearances. " +
        "Resisting the Curse - Throughout the adventure, players must pass Wisdom Saving Throws to resist the creeping influence of the curse, which attempts to pull them into the spectral realm.\n\n" +
        "Dilemmas & Choices: The Source of the Curse - Deep within the ruins, the players will find the true source of the town’s torment—an ancient entity bound by the very magic keeping Black Hollow intact. " +
        "Destroying it will break the curse, but may unleash something even worse. " +
        "Leaving it undisturbed means the town’s suffering will continue, but the greater evil remains sealed.\n\n" +
        "Conclusion & Rewards: If the players destroy the entity, the mist clears, the disappearances stop, and the town slowly rebuilds—but the players may have unleashed a darker force unknowingly. " +
        "If they leave the curse intact, Black Hollow remains a place of whispers and terror, and the villagers continue to live in fear, but the world beyond remains safe. " +
        "Potential Rewards: A rare artifact tied to the curse (a cursed lantern, a shadow-infused weapon, etc.). " +
        "The respect (or fear) of Black Hollow’s people. " +
        "Knowledge of ancient magic that could be used elsewhere. " +
        "The true impact of their choices may not be known until much later in their journey...",
    },
    {
      role: "assistant",
      content:
        "Dark fantasy style, cinematic lighting, and moody color palette. " +
        "A mist-covered town with dimly lit lanterns along a deserted cobblestone road. " +
        "The surrounding forest looms with towering, gnarled trees. " +
        "A ruined chapel sits at the town's edge, with faint, eerie glows coming from within. " +
        "The air feels thick with tension, and ancient symbols are etched into the wooden doors of houses. " +
        "The atmosphere is ominous, with a sky shrouded in heavy gray clouds. " +
        "Soft fog rolls through the streets, distorting the silhouettes of distant figures.",
    },
    {
      role: "user",
      content: description,
    },
  ];
}

module.exports.buildDescPrompt = buildDescPrompt;
module.exports.buildImgPromptPrompt = buildImgPromptPrompt;
