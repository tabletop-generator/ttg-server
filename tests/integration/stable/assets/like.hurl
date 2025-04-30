POST {{host}}/v1/assets/not_a_valid_id/like
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

POST {{host}}/v1/assets/{{update_asset_id}}/like
HTTP 401

POST {{host}}/v1/assets/{{update_asset_id}}/like
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.assetId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.likeCount" isInteger
jsonpath "$.isLikedByCurrentUser" isBoolean
