POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "Test Collection",
  "visibility": "private",
  "description": "Test description"
}
HTTP 201
[Captures]
collection_id: jsonpath "$.collection.id"

DELETE http://localhost:8080/v1/collections/{{collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Collection deleted successfully"

GET http://localhost:8080/v1/collections/{{collection_id}}
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Collection not found"

DELETE http://localhost:8080/v1/collections/abc
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

DELETE http://localhost:8080/v1/collections/999999
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Collection not found"

POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "Test Collection Auth",
  "visibility": "private",
  "description": "Test description for auth"
}
HTTP 201
[Captures]
auth_collection_id: jsonpath "$.collection.id"

DELETE http://localhost:8080/v1/collections/{{auth_collection_id}}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# First, create a collection as user1
POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "Test Collection 2",
  "visibility": "private",
  "description": "Test description"
}
HTTP 201
[Captures]
collection_id_diff: jsonpath "$.collection.id"

DELETE http://localhost:8080/v1/collections/{{collection_id_diff}}
[BasicAuth]
user2@email.com:password2
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"
