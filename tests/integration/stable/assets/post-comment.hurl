POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
HTTP 401

POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
[BasicAuth]
user1@email.com:password1
HTTP 415

POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

POST {{host}}/v1/assets/not_a_valid_id/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 400

POST {{host}}/v1/assets/{{user2_private_asset_id}}/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 403

POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 201
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.displayName" isString
jsonpath "$.commentId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.body" isString
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
