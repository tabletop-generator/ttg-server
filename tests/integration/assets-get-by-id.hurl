# 1. Get asset by UUID (should succeed)
GET http://localhost:8080/v1/assets/{{user1_private_asset_uuid}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.uuid" == "{{user1_private_asset_uuid}}"
jsonpath "$.asset.name" == "User 1 Private Asset"
jsonpath "$.asset.type" == "character"
jsonpath "$.asset.character.race" == "elf"
jsonpath "$.asset.character.class" == "wizard"
jsonpath "$.asset.character.gender" == "female"
jsonpath "$.asset.character.alignment" == "neutral_good"

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

# 4. Test forbidden access
GET http://localhost:8080/v1/assets/{{user1_private_asset_uuid}}
[BasicAuth]
user2@email.com:password2
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"

# 5. Get public asset without needing authentication
GET http://localhost:8080/v1/assets/{{user1_public_asset_uuid}}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.uuid" == "{{user1_public_asset_uuid}}"
