# Add a comment from user1 (same as asset owner)
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{user1_public_asset_uuid}}",
  "body": "Comment from user1 (asset owner)"
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

# Add a comment from user1 on user2's asset
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{user2_public_asset_uuid}}",
  "body": "Comment from user1 on user2's asset"
}

HTTP 201
[Captures]
comment_id_user1_on_user2_asset: jsonpath "$.comment.id"

# 1. Delete a comment as comment author
DELETE http://localhost:8080/v1/comments/{{user1_comment_id}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Comment deleted successfully"

# Verify comment is gone
GET http://localhost:8080/v1/comments?assetId={{user1_public_asset_uuid}}
HTTP 200
[Asserts]
jsonpath "$.comments[*].id" not includes {{user1_comment_id}}

# 2. Delete a comment as asset owner (even if not comment author)
DELETE http://localhost:8080/v1/comments/{{user2_comment_id}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Comment deleted successfully"

# Verify comment is gone
GET http://localhost:8080/v1/comments?assetId={{user1_public_asset_uuid}}
HTTP 200
[Asserts]
jsonpath "$.comments[*].id" not includes {{user2_comment_id}}

# 3. Try to delete a comment when not the asset owner or comment author
DELETE http://localhost:8080/v1/comments/{{comment_id_user1_on_user2_asset}}
[BasicAuth]
user3@email.com:password3

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 4. Try to delete a non-existent comment
DELETE http://localhost:8080/v1/comments/99999
[BasicAuth]
user1@email.com:password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Comment not found"

# 5. Try to delete without authentication
DELETE http://localhost:8080/v1/comments/{{comment_id_user1_on_user2_asset}}

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 6. Delete as comment author (not asset owner)
DELETE http://localhost:8080/v1/comments/{{comment_id_user1_on_user2_asset}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Comment deleted successfully"

# Verify comment is gone
GET http://localhost:8080/v1/comments?assetId={{user2_public_asset_uuid}}
HTTP 200
[Asserts]
jsonpath "$.comments[*].id" not includes {{comment_id_user1_on_user2_asset}}
