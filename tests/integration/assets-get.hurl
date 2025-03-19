# Test GET /assets endpoints

# First create some test assets
# 1. Create user1's public asset
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Test Public Asset",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "human",
    "class": "fighter",
    "gender": "male",
    "alignment": "lawful_good"
  }
}
HTTP 201
[Captures]
public_asset_uuid: jsonpath "$.asset.uuid"

# 2. Create user1's private asset
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Test Private Asset",
  "type": "character",
  "visibility": "private",
  "data": {
    "race": "elf",
    "class": "wizard",
    "gender": "female",
    "alignment": "neutral_good"
  }
}
HTTP 201
[Captures]
private_asset_uuid: jsonpath "$.asset.uuid"

# 3. Create user1's unlisted asset
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Test Unlisted Asset",
  "type": "map",
  "visibility": "unlisted",
  "data": {
    "type": "dungeon",
    "scale": "large"
  }
}
HTTP 201
[Captures]
unlisted_asset_uuid: jsonpath "$.asset.uuid"

# 4. Create user2's public asset
POST http://localhost:8080/v1/assets
[BasicAuth]
user2@email.com:password2
{
  "name": "User2 Public Asset",
  "type": "quest",
  "visibility": "public",
  "data": {
    "type": "rescue",
    "hasCombat": true,
    "hasPuzzles": true,
    "hasSkillChallenges": false,
    "hasDilemmas": true
  }
}
HTTP 201
[Captures]
user2_public_asset_uuid: jsonpath "$.asset.uuid"

# 5. Create user2's private asset
POST http://localhost:8080/v1/assets
[BasicAuth]
user2@email.com:password2
{
  "name": "User2 Private Asset",
  "type": "location",
  "visibility": "private",
  "data": {
    "type": "castle",
    "terrain": "mountains",
    "climate": "cold"
  }
}
HTTP 201

# Get user IDs for testing
GET http://localhost:8080/v1/assets/{{public_asset_uuid}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Captures]
user1_id: jsonpath "$.asset.user.hashedEmail"

GET http://localhost:8080/v1/assets/{{user2_public_asset_uuid}}
[BasicAuth]
user2@email.com:password2
HTTP 200
[Captures]
user2_id: jsonpath "$.asset.user.hashedEmail"

# Create collection for testing asset filtering
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
{
  "name": "Test Collection",
  "description": "A collection for testing asset filtering",
  "visibility": "public",
  "assets": ["{{public_asset_uuid}}", "{{private_asset_uuid}}"]
}
HTTP 201
[Captures]
test_collection_id: jsonpath "$.collection.id"

# Create private collection for testing permissions
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
{
  "name": "Private Test Collection",
  "description": "A private collection for testing permissions",
  "visibility": "private",
  "assets": ["{{unlisted_asset_uuid}}"]
}
HTTP 201
[Captures]
private_collection_id: jsonpath "$.collection.id"

# Test 1: Get all assets (without authentication)
GET http://localhost:8080/v1/assets
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count >= 2
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{user2_public_asset_uuid}}

# Test 2: Get all assets (with user1 authentication)
GET http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count >= 4
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{private_asset_uuid}}
jsonpath "$.assets" includes {{unlisted_asset_uuid}}
jsonpath "$.assets" includes {{user2_public_asset_uuid}}

# Test 3: Filter by name
GET http://localhost:8080/v1/assets?name=Public
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count >= 2
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{user2_public_asset_uuid}}

# Test 4: Filter by type
GET http://localhost:8080/v1/assets?type=map
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count >= 1
jsonpath "$.assets" includes {{unlisted_asset_uuid}}

# Test 5: Filter by userId (own user)
GET http://localhost:8080/v1/assets?userId={{user1_id}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count >= 3
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{private_asset_uuid}}
jsonpath "$.assets" includes {{unlisted_asset_uuid}}

# Test 6: Filter by userId (other user)
GET http://localhost:8080/v1/assets?userId={{user2_id}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count >= 1
jsonpath "$.assets" includes {{user2_public_asset_uuid}}

# Test 7: Filter by visibility
GET http://localhost:8080/v1/assets?visibility=public
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{user2_public_asset_uuid}}

# Test 8: Test with expand=true
GET http://localhost:8080/v1/assets?expand=true&name=Test%20Public
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[0].uuid" == {{public_asset_uuid}}
jsonpath "$.assets[0].name" == "Test Public Asset"
jsonpath "$.assets[0].type" == "character"
jsonpath "$.assets[0].visibility" == "public"
jsonpath "$.assets[0].character.race" == "human"
jsonpath "$.assets[0].character.class" == "fighter"
jsonpath "$.assets[0].user.hashedEmail" exists

# Test 9: Invalid query parameter
GET http://localhost:8080/v1/assets?type=invalid_type
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Invalid query parameters"

# Test 10: Filter by collection ID
GET http://localhost:8080/v1/assets?collectionId={{test_collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count == 2
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{private_asset_uuid}}
jsonpath "$.assets" not includes {{unlisted_asset_uuid}}

# Test 11: Filter by collection with expand=true
GET http://localhost:8080/v1/assets?collectionId={{test_collection_id}}&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count == 2
jsonpath "$.assets[*].uuid" includes {{public_asset_uuid}}
jsonpath "$.assets[*].uuid" includes {{private_asset_uuid}}

# Test 12: Combine collection filter with other filters
GET http://localhost:8080/v1/assets?collectionId={{test_collection_id}}&type=character
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count == 2
jsonpath "$.assets" includes {{public_asset_uuid}}
jsonpath "$.assets" includes {{private_asset_uuid}}

# Test 13: Non-existent collection ID
GET http://localhost:8080/v1/assets?collectionId=99999
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Collection not found"

# Test 14: Access private collection as owner
GET http://localhost:8080/v1/assets?collectionId={{private_collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" includes {{unlisted_asset_uuid}}

# Test 15: Try to access private collection as another user
GET http://localhost:8080/v1/assets?collectionId={{private_collection_id}}
[BasicAuth]
user2@email.com:password2
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Forbidden"

# Test 16: Try to access private collection without authentication
GET http://localhost:8080/v1/assets?collectionId={{private_collection_id}}
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Forbidden"
