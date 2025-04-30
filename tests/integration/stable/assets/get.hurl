GET {{host}}/v1/assets
HTTP 200
[Asserts]
jsonpath "$.assets" isCollection
jsonpath "$.assets[0].assetId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.assets[0].name" isString
jsonpath "$.assets[0].description" isString
jsonpath "$.assets[0].visibility" matches "^public$|^private$|^unlisted$"
jsonpath "$.assets[0].assetType" matches "^character$|^location$|^quest$|^map$"
jsonpath "$.assets[0].likeCount" isInteger
jsonpath "$.assets[0].commentCount" isInteger
jsonpath "$.assets[0].isLikedByCurrentUser" isBoolean
jsonpath "$.assets[0].userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.assets[0].displayName" isString
jsonpath "$.assets[0].createdAt" isIsoDate
jsonpath "$.assets[0].updatedAt" isIsoDate
jsonpath "$.assets[0].imageUrl" matches "^http:\/\/(localhost|minio):9000\/ttg\/"
jsonpath "$.assets[0].data" not exists

# TODO: test query parameters
