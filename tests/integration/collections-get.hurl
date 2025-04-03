POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "Test Collection Public",
  "description": "A public collection by user1",
  "visibility": "public"
}

HTTP 201
[Captures]
collection_id_user1: jsonpath "$.collection.id"
owner_hashedEmail_user1: jsonpath "$.collection.ownerId"

POST http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1

{
  "name": "Test Collection Private",
  "description": "A private collection by user1",
  "visibility": "private"
}

HTTP 201
[Captures]
collection_id_user1_private: jsonpath "$.collection.id"

POST http://localhost:8080/v1/collections
[BasicAuth]
user2@email.com:password2

{
  "name": "User2 Public Collection",
  "description": "A public collection by user2",
  "visibility": "public"
}

HTTP 201
[Captures]
collection_id_user2: jsonpath "$.collection.id"
owner_hashedEmail_user2: jsonpath "$.collection.ownerId"

GET http://localhost:8080/v1/collections
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collections" includes {{collection_id_user1}}
jsonpath "$.collections" includes {{collection_id_user2}}
jsonpath "$.collections" not includes {{collection_id_user1_private}}

GET http://localhost:8080/v1/collections?expand=true
[BasicAuth]
user2@email.com:password2
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collections[?(@.id == {{collection_id_user1}})].name" includes "Test Collection Public"
jsonpath "$.collections[?(@.id == {{collection_id_user1}})].visibility" includes "public"
jsonpath "$.collections[?(@.id == {{collection_id_user1}})].ownerId" includes "{{owner_hashedEmail_user1}}"
jsonpath "$.collections[?(@.id == {{collection_id_user1}})].createdAt" exists
jsonpath "$.collections[?(@.id == {{collection_id_user1}})].updatedAt" exists
jsonpath "$.collections[?(@.id == {{collection_id_user1}})].assets" exists

GET http://localhost:8080/v1/collections?userId={{owner_hashedEmail_user1}}&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collections[?(@.id == {{collection_id_user1}})]" exists
jsonpath "$.collections[?(@.id == {{collection_id_user1_private}})]" exists

GET http://localhost:8080/v1/collections?userId={{owner_hashedEmail_user2}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collections" includes {{collection_id_user2}}
jsonpath "$.collections" not includes {{collection_id_user1_private}}

GET http://localhost:8080/v1/collections?userId=invalid_user
[BasicAuth]
user1@email.com:password1  # Add authentication
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "User not found"
# 6. Name filter for current user
GET http://localhost:8080/v1/collections?userId={{owner_hashedEmail_user1}}&name=Private&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collections[?(@.name == 'Test Collection Private')]" exists
jsonpath "$.collections[?(@.name == 'Test Collection Public')]" count == 0
