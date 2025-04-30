PATCH {{host}}/v1/collections/{{user1_collection_id}}
HTTP 401

PATCH {{host}}/v1/collections/{{user1_collection_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

PATCH {{host}}/v1/collections/{{user1_collection_id}}
Content-Type: application/json
[BasicAuth]
user2@email.com:password2
file,collection-update.json;
HTTP 403

PATCH {{host}}/v1/collections/{{user1_collection_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection-update.json;
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.displayName" isString
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.visibility" matches "^public$|^private$|^unlisted$"
jsonpath "$.name" isString
jsonpath "$.description" isString
jsonpath "$.assetCount" isInteger
jsonpath "$.assets" isCollection
