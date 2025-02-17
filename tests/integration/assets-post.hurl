POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Thalor Duskbane",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "tiefling",
    "class": "warlock",
    "gender": "male",
    "alignment": "neutral_evil",
    "appearance": "Ash-gray skin, glowing red eyes, long black horns that curl back, dressed in a dark crimson cloak with intricate silver embroidery.",
    "personality": "Manipulative, cunning, and deeply ambitious. Thalor is charismatic but hides a volatile temper.",
    "background": "Born to a cursed bloodline, Thalor made a pact with an ancient fiend to escape his family's downfall. He now roams the world seeking forbidden knowledge and power.",
    "abilities": "Eldritch blast, dark pact magic, charisma-based deception, summoning minor fiends.",
    "equipment": "A jagged obsidian staff that pulses with a faint red glow, a spell tome bound in cracked leather, and a vial of fiendish ichor.",
    "motivation": "To ascend to ultimate power and break free from his fiendish master's control."
  }
}

HTTP/1.1 201
[Captures]
uuid: jsonpath "$.asset.uuid"
[Asserts]
header "Location" matches "^(http|https):\/\/localhost:8080\/v1\/assets\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.asset.id" isInteger
jsonpath "$.asset.uuid" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.asset.creatorId" isInteger
jsonpath "$.asset.createdAt" isIsoDate
jsonpath "$.asset.updatedAt" isIsoDate
jsonpath "$.asset.isFeatured" isBoolean
jsonpath "$.asset.likes" isInteger
jsonpath "$.asset.type" matches "^character$|^location$|^quest$|^map$"
jsonpath "$.asset.name" isString
jsonpath "$.asset.description" isString
jsonpath "$.asset.imageUrl" matches "^http:\/\/(localhost|minio):9000\/ttg\/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a\/{{uuid}}"
jsonpath "$.asset.imageUrlExpiry" isIsoDate
