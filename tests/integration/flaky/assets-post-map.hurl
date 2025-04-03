POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "The Dungeon of Doom",
  "type": "map",
  "visibility": "unlisted",
  "data": {
    "type": "dungeon",
    "scale": "medium",
    "terrain": "bridges",
    "pointsOfInterest": "The Broken Gate, The Hanging Chasm, The Obsidian Altar",
    "customDescription": "The map depicts a vast network of twisting tunnels, some carved by ancient hands, others eroded by time. A collapsed bridge spans a deep chasm, its stonework shattered and hanging by a thread. At the heart of the dungeon, a towering obsidian altar hums with dark energy, casting eerie shadows against the walls. Scattered fortifications suggest past battles, and the air is thick with dust and the scent of damp stone. The atmosphere is one of lingering danger, as if something unseen still lurks in the depths."
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
