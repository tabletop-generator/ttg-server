# Test creating a new user
POST http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"

# Test creating the same user again (idempotent)
POST http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"

# Test without authentication
POST http://localhost:8080/v1/users

HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# Test with invalid credentials
POST http://localhost:8080/v1/users
[BasicAuth]
invalid@email.com:wrongpassword

HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
