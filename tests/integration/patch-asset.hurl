# Test PATCH /assets/:assetId endpoints

# 1. Update asset (should succeed)
PATCH http://localhost:8080/v1/assets/1
[BasicAuth]
user1@email.com:password1
{
    "name": "Updated Asset Name",
    "description": "Updated description",
    "visibility": "public"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset" exists
jsonpath "$.asset.name" == "Updated Asset Name"
jsonpath "$.asset.description" == "Updated description"
jsonpath "$.asset.visibility" == "public"

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
PATCH http://localhost:8080/v1/assets/1
{
    "name": "Test Name"
}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 5. Update someone else's asset (should fail)
PATCH http://localhost:8080/v1/assets/2
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
