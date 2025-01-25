# Test POST /users endpoint

# 1. Create new user (should succeed)
POST http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
HTTP 201
[Asserts]
jsonpath "$.status" == "ok"

# 2. Create same user again (should succeed with 201)
POST http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
HTTP 201
[Asserts]
jsonpath "$.status" == "ok"

# 3. Test without authentication (should fail)
POST http://localhost:8080/v1/users
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 4. Test with invalid credentials (should fail)
POST http://localhost:8080/v1/users
[BasicAuth]
invalid@email.com:wrongpassword
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
