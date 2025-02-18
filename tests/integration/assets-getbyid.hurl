# First create test data
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
asset_uuid: jsonpath "$.asset.uuid"

# 1. Get asset by UUID (should succeed)
GET http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.uuid" == "{{asset_uuid}}"
jsonpath "$.asset.name" == "Thalor Duskbane"
jsonpath "$.asset.type" == "character"
jsonpath "$.asset.character.race" == "tiefling"
jsonpath "$.asset.character.class" == "warlock"

# 2. Get non-existent asset
GET http://localhost:8080/v1/assets/123e4567-e89b-12d3-a456-426614174000
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"

# 3. Get asset with invalid UUID format
GET http://localhost:8080/v1/assets/not-a-uuid
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400


# 4. Test unauthorized access
GET http://localhost:8080/v1/assets/{{asset_uuid}}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 5. Test forbidden access
GET http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user2@email.com:password2

HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"

