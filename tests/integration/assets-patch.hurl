# Test PATCH /assets/:assetId endpoints

# First ensure user1 exists
POST http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1

# Create the test asset
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

# 1. Update asset (should succeed)
PATCH http://localhost:8080/v1/assets/{{asset_id}}
[BasicAuth]
user1@email.com:password1
{
    "name": "Updated Thalor Duskbane",
    "description": "Updated description",
    "visibility": "private"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset" exists
jsonpath "$.asset.name" == "Updated Thalor Duskbane"
jsonpath "$.asset.description" == "Updated description"
jsonpath "$.asset.visibility" == "private"

# Ensure user2 exists before testing forbidden access
POST http://localhost:8080/v1/users
[BasicAuth]
user2@email.com:password2

# 2. Update non-existent asset (should fail)
PATCH http://localhost:8080/v1/assets/999999
[BasicAuth]
user1@email.com:password1
{
    "name": "Test Name"
}
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "asset not found"

# 3. Update asset with invalid ID format
PATCH http://localhost:8080/v1/assets/invalid-id
[BasicAuth]
user1@email.com:password1
{
    "name": "Test Name"
}
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "invalid asset id"

# 4. Update asset without authentication
PATCH http://localhost:8080/v1/assets/{{asset_id}}
{
    "name": "Test Name"
}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 5. Update someone else's asset (should fail)
# Create another user's asset
POST http://localhost:8080/v1/assets
[BasicAuth]
user2@email.com:password2
{
  "type": "character",
  "visibility": "public",
  "data": {
    "name": "Other User's Character",
    "race": "human",
    "class": "fighter",
    "gender": "male",
    "alignment": "lawful_good"
  }
}
HTTP 201
[Captures]
other_asset_id: jsonpath "$.id"

# Try to update other user's asset
PATCH http://localhost:8080/v1/assets/{{other_asset_id}}
[BasicAuth]
user1@email.com:password1
{
    "name": "Test Name"
}
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "forbidden"
