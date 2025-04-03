POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "The temple",
  "type": "quest",
  "visibility": "unlisted",
  "data": {
    "type": "retrieval",
    "tone": "Dark and mysterious",
    "location": "Abandoned temple in a dense jungle",
    "complexity": "Moderate",
    "objective": "Recover a stolen artifact",
    "antagonist": "A rival treasure hunter",
    "notableNpcs": "The temple's ancient guardian spirit",
    "hasCombat": true,
    "hasPuzzles": true,
    "hasSkillChallenges": true,
    "hasDilemmas": true,
    "customDescription": "The party is tasked with retrieving a mystical artifact hidden deep within an abandoned jungle temple, but the temple is guarded by traps, puzzles, and a rival adventurer. The guardian spirit warns the party of the artifact's curse, leaving them to decide whether the treasure is worth the risk."
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
