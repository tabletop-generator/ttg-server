GET {{host}}/v1/collections/not_a_valid_id
HTTP 400

GET {{host}}/v1/collections/{{user1_collection_id}}
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.displayName" isString
jsonpath "$.collectionId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.visibility" matches "^public$|^private$|^unlisted$"
jsonpath "$.name" isString
jsonpath "$.description" isString
jsonpath "$.assetCount" isInteger
jsonpath "$.assets" isCollection
jsonpath "$.coverImageUrl" matches "^http:\/\/(localhost|minio):9000\/ttg\/"

# TODO: test private and unlisted collections
