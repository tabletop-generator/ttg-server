PATCH {{host}}/v1/assets/not_a_valid_id
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

PATCH {{host}}/v1/assets/{{update_asset_id}}
HTTP 401

PATCH {{host}}/v1/assets/{{update_asset_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,asset-update.json;
HTTP 200
[Asserts]
jsonpath "$.assetId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.name" isString
jsonpath "$.description" isString
jsonpath "$.visibility" matches "^public$|^private$|^unlisted$"
jsonpath "$.assetType" matches "^character$|^location$|^quest$|^map$"
jsonpath "$.likeCount" isInteger
jsonpath "$.commentCount" isInteger
jsonpath "$.isLikedByCurrentUser" isBoolean
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.displayName" isString
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.imageUrl" matches "^http:\/\/(localhost|minio):9000\/ttg\/"
jsonpath "$.data" exists
