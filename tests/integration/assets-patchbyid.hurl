# Test PATCH /assets/:assetId endpoints

# First create an asset to update
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
initial_description: jsonpath "$.asset.description"  # Capture the initial description

# Create another asset owned by user2 (for forbidden test)
POST http://localhost:8080/v1/assets
[BasicAuth]
user2@email.com:password2
{
  "name": "Other User's Asset",
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
other_asset_uuid: jsonpath "$.asset.uuid"

# 1. Update asset successfully
PATCH http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user1@email.com:password1
{
    "name": "Updated Name",
    "visibility": "private"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.name" == "Updated Name"
jsonpath "$.asset.visibility" == "private"

# 2. Update non-existent asset
PATCH http://localhost:8080/v1/assets/123e4567-e89b-12d3-a456-426614174000
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
PATCH http://localhost:8080/v1/assets/{{asset_uuid}}
{
    "name": "Test Name"
}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 5. Update someone else's asset (should fail)
# Try to update other user's asset
PATCH http://localhost:8080/v1/assets/{{other_asset_uuid}}
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

# 6. Update only specific fields (description should remain unchanged)
PATCH http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user1@email.com:password1
{
    "name": "Partial Update Name",
    "visibility": "unlisted"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.name" == "Partial Update Name"
jsonpath "$.asset.visibility" == "unlisted"
jsonpath "$.asset.description" == {{initial_description}}  # Should match the auto-generated description

# 7. Add a description
PATCH http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user1@email.com:password1
{
    "description": "New description"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.name" == "Partial Update Name"  # Name should remain unchanged
jsonpath "$.asset.visibility" == "unlisted"  # Visibility should remain unchanged
jsonpath "$.asset.description" == "New description"
