# Test comment creation endpoint

# First create an asset to comment on
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Asset for Comments",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "human",
    "class": "bard",
    "gender": "female",
    "alignment": "chaotic_good"
  }
}

HTTP 201
[Captures]
asset_uuid: jsonpath "$.asset.uuid"

# 1. Create a comment successfully
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{asset_uuid}}",
  "body": "This is a test comment"
}

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.comment.id" isInteger
jsonpath "$.comment.assetId" == "{{asset_uuid}}"
jsonpath "$.comment.userId" == "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a"
jsonpath "$.comment.created" isIsoDate
jsonpath "$.comment.updated" isIsoDate
jsonpath "$.comment.body" == "This is a test comment"

# 2. Create a comment with invalid asset ID
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "00000000-0000-0000-0000-000000000000",
  "body": "This is a test comment"
}

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Asset not found"

# 3. Create a comment with missing required fields
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "body": "Missing asset ID"
}

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid comment data"

# 4. Create a comment without authentication
POST http://localhost:8080/v1/comments
{
  "assetId": "{{asset_uuid}}",
  "body": "This is a test comment"
}

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized" 
