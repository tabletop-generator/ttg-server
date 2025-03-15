# ------------------------------------------
# Setup: Create Collections for Testing
# ------------------------------------------

# Create a collection for user1 (public)
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "User1 Collection",
  "description": "Collection created by user1",
  "visibility": "public"
}
HTTP 201
[Captures]
collection_id_user1: jsonpath "$.collection.id"
owner_hashedEmail_user1: jsonpath "$.collection.ownerId"

# Create a collection for user2 (private) for forbidden test
POST http://localhost:8080/v1/collections
[BasicAuth]
user2@email.com:password2

{
  "name": "User2 Collection",
  "description": "Collection created by user2",
  "visibility": "private"
}
HTTP 201
[Captures]
collection_id_user2: jsonpath "$.collection.id"
owner_hashedEmail_user2: jsonpath "$.collection.ownerId"

# ------------------------------------------
# DELETE /collections/:collectionId Tests
# ------------------------------------------

# 1. Delete collection for current user (user1) - should succeed
DELETE http://localhost:8080/v1/collections/{{collection_id_user1}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Collection deleted successfully"

# 2. Delete non-existent collection (e.g., id 99999) - should return 404
DELETE http://localhost:8080/v1/collections/99999
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Collection not found"

# 3. Delete with invalid collection ID format (e.g., "abc") - should return 400
DELETE http://localhost:8080/v1/collections/abc
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Invalid collection ID"

# 4. Delete collection that does not belong to current user 
# (user1 attempting to delete user2's collection) - should return 403
DELETE http://localhost:8080/v1/collections/{{collection_id_user2}}
[BasicAuth]
user1@email.com:password1
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"

# 5. Delete collection without authentication - should return 401
DELETE http://localhost:8080/v1/collections/{{collection_id_user1}}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 6. Delete collection with invalid credentials - should return 401
DELETE http://localhost:8080/v1/collections/{{collection_id_user1}}
[BasicAuth]
user1@email.com:wrongpassword
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
