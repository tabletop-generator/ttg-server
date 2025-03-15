POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "PublicCollection",
  "description": "A public collection by user1",
  "visibility": "public"
}
HTTP 201
[Captures]
collection_id_user1: jsonpath "$.collection.id"
owner_hashedEmail_user1: jsonpath "$.collection.ownerId"

# Create a private collection for user2
POST http://localhost:8080/v1/collections
[BasicAuth]
user2@email.com:password2

{
  "name": "PrivateCollection",
  "description": "A private collection by user2",
  "visibility": "private"
}
HTTP 201
[Captures]
collection_id_user2: jsonpath "$.collection.id"
owner_hashedEmail_user2: jsonpath "$.collection.ownerId"


GET http://localhost:8080/v1/collections/{{collection_id_user1}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collection.id" == {{collection_id_user1}}
jsonpath "$.collection.visibility" == "public"

GET http://localhost:8080/v1/collections/{{collection_id_user1}}
[BasicAuth]
user2@email.com:password2
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collection.id" == {{collection_id_user1}}
jsonpath "$.collection.visibility" == "public"

GET http://localhost:8080/v1/collections/{{collection_id_user2}}
[BasicAuth]
user1@email.com:password1
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"

GET http://localhost:8080/v1/collections/123e4567-e89b-12d3-a456-426614174000
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid collection id"

GET http://localhost:8080/v1/collections/99999
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Collection not found"
