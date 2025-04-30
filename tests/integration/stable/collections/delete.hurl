POST {{host}}/v1/collections
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection.json;
HTTP 201
[Captures]
collection_id: jsonpath "$.collectionId"

DELETE {{host}}/v1/collections/{{collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 204
