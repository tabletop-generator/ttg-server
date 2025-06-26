POST {{host}}/v1/collections
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection.json;
HTTP 201
[Captures]
collection_id: jsonpath "$.collectionId"

PATCH {{host}}/v1/collections/{{collection_id}}
HTTP 401

PATCH {{host}}/v1/collections/{{collection_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

PATCH {{host}}/v1/collections/{{collection_id}}
Content-Type: application/json
[BasicAuth]
user2@email.com:password2
file,collection-update.json;
HTTP 403

PATCH {{host}}/v1/collections/{{collection_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection-update.json;
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

DELETE {{host}}/v1/collections/{{collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 204
