POST {{host}}/v1/collections
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection.json;
HTTP 201
[Captures]
collection_id: jsonpath "$.collectionId"

POST {{host}}/v1/collections/{{collection_id}}/assets
HTTP 401

POST {{host}}/v1/collections/{{collection_id}}/assets
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

POST {{host}}/v1/collections/{{collection_id}}/assets
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{
  "assetIds": ["{{user1_public_asset_id}}", "{{user1_unlisted_asset_id}}", "{{user1_private_asset_id}}", "{{user2_public_asset_id}}"]
}
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
jsonpath "$.assets[?(@.assetId == '{{user1_public_asset_id}}')].assetId" exists
jsonpath "$.assets[?(@.assetId == '{{user1_unlisted_asset_id}}')].assetId" exists
jsonpath "$.assets[?(@.assetId == '{{user1_private_asset_id}}')].assetId" exists
jsonpath "$.assets[?(@.assetId == '{{user2_public_asset_id}}')].assetId" exists

POST {{host}}/v1/collections/{{collection_id}}/assets
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{
  "assetIds": ["{{user2_private_asset_id}}"]
}
HTTP 403

POST {{host}}/v1/collections/{{collection_id}}/assets/remove
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{
  "assetIds": ["{{user1_public_asset_id}}", "{{user1_unlisted_asset_id}}", "{{user1_private_asset_id}}", "{{user2_public_asset_id}}"]
}
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
jsonpath "$.assetCount" == 0
jsonpath "$.assets" isEmpty
jsonpath "$.coverImageUrl" == null

DELETE {{host}}/v1/collections/{{collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 204
