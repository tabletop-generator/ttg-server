# Test for getting comments by asset ID

# First create an asset to comment on
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Asset for Comments Get Test",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "elf",
    "class": "wizard",
    "gender": "male",
    "alignment": "lawful_neutral"
  }
}

HTTP 201
[Captures]
asset_uuid: jsonpath "$.asset.uuid"

# Add first comment to the asset
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{asset_uuid}}",
  "body": "First test comment"
}

HTTP 201

# Add second comment from a different user
POST http://localhost:8080/v1/comments
[BasicAuth]
user2@email.com:password2
{
  "assetId": "{{asset_uuid}}",
  "body": "Second test comment"
}

HTTP 201

# 1. Get comments for an asset successfully
GET http://localhost:8080/v1/comments?assetId={{asset_uuid}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.comments" isCollection
jsonpath "$.comments[0].assetId" == "{{asset_uuid}}"
jsonpath "$.comments[1].assetId" == "{{asset_uuid}}"
jsonpath "$.comments[*].body" includes "First test comment"
jsonpath "$.comments[*].body" includes "Second test comment"

# 2. Get comments without providing assetId
GET http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "assetId parameter is required and must be a valid UUID"

# 3. Get comments for non-existent asset
GET http://localhost:8080/v1/comments?assetId=00000000-0000-0000-0000-000000000000
[BasicAuth]
user1@email.com:password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error" 
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"


# 4. Comments endpoint should allow unauthenticated access for GET requests
GET http://localhost:8080/v1/comments?assetId={{asset_uuid}}

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.comments" isCollection
jsonpath "$.comments[0].assetId" == "{{asset_uuid}}"
jsonpath "$.comments[1].assetId" == "{{asset_uuid}}"
jsonpath "$.comments[*].body" includes "First test comment"
jsonpath "$.comments[*].body" includes "Second test comment" 

