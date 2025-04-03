# Test updating comments by ID

# Add a comment from user1
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{user1_public_asset_uuid}}",
  "body": "Original comment from user1"
}

HTTP 201
[Captures]
user1_comment_id: jsonpath "$.comment.id"

# Add another comment from user2
POST http://localhost:8080/v1/comments
[BasicAuth]
user2@email.com:password2
{
  "assetId": "{{user1_public_asset_uuid}}",
  "body": "Comment from user2"
}

HTTP 201
[Captures]
user2_comment_id: jsonpath "$.comment.id"

# 1. Update comment successfully
PATCH http://localhost:8080/v1/comments/{{user1_comment_id}}
[BasicAuth]
user1@email.com:password1
{
  "body": "Updated comment from user1"
}

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.comment.id" == {{user1_comment_id}}
jsonpath "$.comment.assetId" == "{{user1_public_asset_uuid}}"
jsonpath "$.comment.body" == "Updated comment from user1"
jsonpath "$.comment.updatedAt" != "$.comment.createdAt"

# 2. Try to update another user's comment (should fail)
PATCH http://localhost:8080/v1/comments/{{user2_comment_id}}
[BasicAuth]
user1@email.com:password1
{
  "body": "Trying to update user2's comment"
}

HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"

# 3. Try to update a non-existent comment
PATCH http://localhost:8080/v1/comments/99999
[BasicAuth]
user1@email.com:password1
{
  "body": "This comment doesn't exist"
}

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Comment not found"

# 4. Try to update with invalid data
PATCH http://localhost:8080/v1/comments/{{user1_comment_id}}
[BasicAuth]
user1@email.com:password1
{
  "body": ""
}

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid comment data"

# 5. Try to update without authentication
PATCH http://localhost:8080/v1/comments/{{user1_comment_id}}
{
  "body": "Update without auth"
}

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized" 
