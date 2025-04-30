POST {{host}}/v1/assets
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,character.json;
HTTP 201
[Captures]
assetId: jsonpath "$.assetId"
[Asserts]
header "Location" matches "^{{host}}\/v1\/assets\/[A-Za-z0-9_-]+$"
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
jsonpath "$.imageUrl" matches "^http:\/\/(localhost|minio):9000\/ttg\/{{user1_id}}\/{{assetId}}"
jsonpath "$.data" exists
