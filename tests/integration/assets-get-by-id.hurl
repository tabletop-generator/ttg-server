# First create test data
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "type": "character",
  "visibility": "public",
  "data": {
    "name": "Thalor Duskbane",
    "race": "tiefling",
    "class": "warlock",
    "gender": "male",
    "alignment": "neutral_evil",
    "appearance": "Ash-gray skin, glowing red eyes",
    "personality": "Manipulative and cunning",
    "background": "Born to a cursed bloodline",
    "abilities": "Eldritch blast",
    "equipment": "Obsidian staff",
    "motivation": "Seek power"
  }
}
HTTP 201
[Captures]
asset_id: jsonpath "$.id"

# 1. Get asset by ID (should succeed)
GET http://localhost:8080/v1/assets/{{asset_id}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.id" == {{asset_id}}
jsonpath "$.asset.name" == "Thalor Duskbane"
jsonpath "$.asset.type" == "character"
jsonpath "$.asset.character.race" == "tiefling"
jsonpath "$.asset.character.class" == "warlock"

# 2. Get non-existent asset
GET http://localhost:8080/v1/assets/999999
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"

# 3. Get asset with invalid ID format
GET http://localhost:8080/v1/assets/invalid-id
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid asset ID format"

# 4. Test unauthorized access
GET http://localhost:8080/v1/assets/{{asset_id}}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized" 
