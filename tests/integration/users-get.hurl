# Get User by ID (Valid)
GET http://localhost:8080/v1/users/1
Accept: application/json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.id" == 1
jsonpath "$.displayName" exists
jsonpath "$.hashedEmail" exists
jsonpath "$.joinDate" exists


# Get User with Non-Existing ID
GET http://localhost:8080/v1/users/999999
Accept: application/json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
[Asserts]
jsonpath "$.error.message" == "User not found"


# Get User with Invalid ID (Not a Number)
GET http://localhost:8080/v1/users/abc
Accept: application/json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 400
[Asserts]
jsonpath "$.error.message" == "Invalid user ID"


# Get User Without Authorization
GET http://localhost:8080/v1/users/1
Accept: application/json

HTTP/1.1 401
[Asserts]
jsonpath "$.error.message" == "Unauthorized"
