POST {{host}}/v1/collections
HTTP 401

POST {{host}}/v1/collections
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection.json;
HTTP 201
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
jsonpath "$.coverImageUrl" == null
