# Test collections creation endpoint

# 1. Create a collection with required fields
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
{
  "name": "My Fantasy Campaign",
  "visibility": "public"
}

HTTP 201
[Captures]
collection_id: jsonpath "$.collection.id"
[Asserts]
header "Location" matches "^(http|https):\/\/localhost:8080\/v1\/collections\/[0-9]+$"
jsonpath "$.status" == "ok"
jsonpath "$.collection.id" isInteger
jsonpath "$.collection.ownerId" == "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a"
jsonpath "$.collection.createdAt" isIsoDate
jsonpath "$.collection.updatedAt" isIsoDate
jsonpath "$.collection.name" == "My Fantasy Campaign"
jsonpath "$.collection.visibility" == "public"
jsonpath "$.collection.assets" count == 0

# 2. Create a collection with all fields
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
{
  "name": "My Private Collection",
  "description": "A collection of my private assets",
  "visibility": "private"
}

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collection.id" isInteger
jsonpath "$.collection.description" == "A collection of my private assets"
jsonpath "$.collection.visibility" == "private"

# 3. Test collection creation with invalid data
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
{
  "name": "",
  "visibility": "invalid_visibility"
}

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid collection data"

# 4. Test collection creation without authentication
POST http://localhost:8080/v1/collections
{
  "name": "Unauthenticated Collection",
  "visibility": "public"
}

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 5. Create a collection with assets (first create an asset to use)
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Collection Test Character",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "human",
    "class": "bard",
    "gender": "female",
    "alignment": "chaotic_good"
  }
}

HTTP 201
[Captures]
asset_uuid: jsonpath "$.asset.uuid"

# Now create a collection with this asset
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
{
  "name": "Collection With Assets",
  "visibility": "public",
  "assets": ["{{asset_uuid}}"]
}

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collection.assets" count == 1
jsonpath "$.collection.assets[0]" == "{{asset_uuid}}" 
