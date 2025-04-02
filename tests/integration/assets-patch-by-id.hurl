# Test PATCH /assets/:assetId endpoints

# 1. Update asset successfully
PATCH http://localhost:8080/v1/assets/{{update_asset_uuid}}
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
PATCH http://localhost:8080/v1/assets/{{update_asset_uuid}}
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
PATCH http://localhost:8080/v1/assets/{{user2_public_asset_uuid}}
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
PATCH http://localhost:8080/v1/assets/{{update_asset_uuid}}
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
jsonpath "$.asset.description" == null  # Should match the auto-generated description

# 7. Add a description
PATCH http://localhost:8080/v1/assets/{{update_asset_uuid}}
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

# 8. Restore original values
PATCH http://localhost:8080/v1/assets/{{update_asset_uuid}}
[BasicAuth]
user1@email.com:password1
{
    "name": "Asset for testing updating",
    "description": null,
    "visibility": "public"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.name" == "Asset for testing updating"
jsonpath "$.asset.visibility" == "public"
jsonpath "$.asset.description" == null
