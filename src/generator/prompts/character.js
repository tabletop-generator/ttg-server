/**
 * Builds a prompt to generate a description
 * @param {Object}
 * @returns {Object[]}
 */
function buildDescPrompt(
  name,
  {
    race,
    class: charClass,
    gender,
    alignment,
    appearance,
    personality,
    background,
    abilities,
    equipment,
    motivation,
  },
) {
  return [
    {
      role: "system",
      content:
        "You are a creative assistant helping to generate detailed " +
        "character descriptions for tabletop role-playing games. Provide a " +
        "vivid, engaging description of the character's appearance, " +
        "personality, background, and any notable traits. The tone should " +
        "match the character's personality and role in the story. Use " +
        "descriptive language and sensory details, but avoid excessive length " +
        "(aim for 100-150 words).",
    },
    {
      role: "user",
      content:
        "Name: Kaelith Shadowthorn" +
        "Race: Half-Elf" +
        "Class: Rogue" +
        "Gender: Female" +
        "Alignment: Chaotic Neutral" +
        "Appearance: Jet-black hair tied into a loose braid, amber eyes, faint scar on left cheek, dark leather tunic, dagger at her side." +
        "Personality: Sarcastic, cunning, fiercely independent, dislikes authority." +
        "Background: Orphan in a port city, survived through pickpocketing, joined and left a thieves' guild due to clashing with hierarchy." +
        "Abilities: Stealth, lock-picking, deception, dual-wielding daggers." +
        "Equipment: Obsidian dagger, lockpicks, grappling hook, smoke bombs." +
        "Motivation: Discover her lineage, seeking gold and thrill of danger.",
    },
    {
      role: "assistant",
      content:
        "Kaelith Shadowthorn moves like a shadow slipping between cracks of light, her jet-black braid swaying behind her as she prowls the night. Her amber eyes shimmer like molten gold, constantly scanning for threats—or opportunities. The faint scar on her left cheek is a trophy from a heist gone wrong, a reminder that even the sharpest blade can falter. Wrapped in a dark leather tunic that seems to drink in the shadows, she carries an obsidian dagger so sharp it whispers as it cuts the air." +
        "Kaelith’s childhood in the chaotic streets of Aeloria was one of survival and ambition. Orphaned and overlooked, she learned quickly that clever hands and quick feet were her only allies. The thieves’ guild gave her purpose for a time, but her disdain for orders and hierarchy led her to burn that bridge—literally." +
        "Now a rogue with no master, Kaelith embraces the thrill of freedom and danger. Her skills are unparalleled: she moves unseen, her lock-picking tools a symphony of clicks, her words weaving truths and lies into whatever shape suits her purpose. Her obsidian dagger is her closest companion, but a grappling hook and a smoke bomb are never far from reach." +
        "Driven by the tantalizing mystery of her lineage, Kaelith dreams of uncovering power hidden in her bloodline—but until then, the glint of gold and the adrenaline of risk keep her sharp and restless.",
    },
    {
      role: "user",
      content:
        `Name: ${name}\n` +
        `Race: ${race}\n` +
        `Class: ${charClass}\n` +
        `Gender: ${gender}\n` +
        `Alignment: ${alignment}\n` +
        (appearance ? `Appearance: ${appearance}\n` : "") +
        (personality ? `Personality: ${personality}\n` : "") +
        (background ? `Backstory: ${background}\n` : "") +
        (abilities ? `Abilities: ${abilities}\n` : "") +
        (equipment ? `Equipment: ${equipment}\n` : "") +
        (motivation ? `Motivation: ${motivation}` : ""),
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
        "You are a creative assistant specializing in translating descriptive " +
        "text into visual prompts for text-to-image models. Your task is to " +
        "condense a detailed description into a clear, concise prompt that " +
        "emphasizes visual and stylistic elements. Highlight key details " +
        "such as appearance, setting, mood, and important features. Strictly " +
        "focus on visual description and avoid abstract concepts or non-visual " +
        "adjectives. Write in prose but keep it brief. Include all of the " +
        "attributes specified by the user but avoid names.",
    },
    {
      role: "user",
      content:
        "Kaelith Shadowthorn moves like a shadow slipping between cracks of light, her jet-black braid swaying behind her as she prowls the night. Her amber eyes shimmer like molten gold, constantly scanning for threats—or opportunities. The faint scar on her left cheek is a trophy from a heist gone wrong, a reminder that even the sharpest blade can falter. Wrapped in a dark leather tunic that seems to drink in the shadows, she carries an obsidian dagger so sharp it whispers as it cuts the air." +
        "Kaelith’s childhood in the chaotic streets of Aeloria was one of survival and ambition. Orphaned and overlooked, she learned quickly that clever hands and quick feet were her only allies. The thieves’ guild gave her purpose for a time, but her disdain for orders and hierarchy led her to burn that bridge—literally." +
        "Now a rogue with no master, Kaelith embraces the thrill of freedom and danger. Her skills are unparalleled: she moves unseen, her lock-picking tools a symphony of clicks, her words weaving truths and lies into whatever shape suits her purpose. Her obsidian dagger is her closest companion, but a grappling hook and a smoke bomb are never far from reach." +
        "Driven by the tantalizing mystery of her lineage, Kaelith dreams of uncovering power hidden in her bloodline—but until then, the glint of gold and the adrenaline of risk keep her sharp and restless.",
    },
    {
      role: "assistant",
      content:
        "Expressionist fantasy art style, sharp details, and dramatic lighting." +
        "A cunning half-elf rogue with jet-black hair in a loose braid, " +
        "piercing amber eyes, and a faint scar on her left cheek. She " +
        "wears a dark leather hooded tunic and wields an obsidian dagger. " +
        "The setting is a dimly lit alleyway, with shadows casting a tense " +
        "and mysterious atmosphere.",
    },
    {
      role: "user",
      content: description,
    },
  ];
}

module.exports.buildDescPrompt = buildDescPrompt;
module.exports.buildImgPromptPrompt = buildImgPromptPrompt;
