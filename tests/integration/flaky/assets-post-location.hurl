POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "The Ruins",
  "type": "location",
  "visibility": "public",
  "data": {
    "type": "ruins",
    "terrain": "forest",
    "climate": "snowy",
    "atmosphere": "somber",
    "inhabitants": "none",
    "dangerLevel": "none",
    "pointsOfInterest": "The ruins",
    "customDescription": "A place of reflection"
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
