POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 201
[Captures]
comment_id: jsonpath "$.commentId"

GET {{host}}/v1/assets/not_a_valid_id/comments
[BasicAuth]
user1@email.com:password1
HTTP 400

GET {{host}}/v1/assets/{{user2_private_asset_id}}/comments
[BasicAuth]
user1@email.com:password1
HTTP 403

GET {{host}}/v1/assets/{{user1_public_asset_id}}/comments
HTTP 200

GET {{host}}/v1/assets/{{user1_public_asset_id}}/comments
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.comments[0].userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.comments[0].displayName" isString
jsonpath "$.comments[*].commentId" contains {{comment_id}}
jsonpath "$.comments[0].commentId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.comments[0].body" isString
jsonpath "$.comments[0].createdAt" isIsoDate
jsonpath "$.comments[0].updatedAt" isIsoDate

DELETE {{host}}/v1/comments/{{comment_id}}
[BasicAuth]
user1@email.com:password1
HTTP 204

# TODO: test query parameters
