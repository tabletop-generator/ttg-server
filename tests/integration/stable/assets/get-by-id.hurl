GET {{host}}/v1/assets/not_a_valid_id
HTTP 400

GET {{host}}/v1/assets/{{user1_private_asset_id}}
HTTP 403

GET {{host}}/v1/assets/{{user1_public_asset_id}}
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.displayName" isString
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

# TODO: test query parameters
