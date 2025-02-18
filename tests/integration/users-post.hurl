# Test creating a new user
POST http://localhost:8080/v1/users
[BasicAuth]
newuser@email.com:newpassword

HTTP/1.1 201
[Asserts]
header "Location" matches "^(http|https):\/\/localhost:8080\/v1\/users\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.user.id" isInteger
jsonpath "$.user.hashedEmail" matches /^[0-9a-fA-F]+$/
jsonpath "$.user.displayName" isString
jsonpath "$.user.profileBio" isString
jsonpath "$.user.profilePictureUrl" exists # These are nullable so this is all we can assert
jsonpath "$.user.profilePictureUrlExpiry" exists

# Test creating the same user again (idempotent)
POST http://localhost:8080/v1/users
[BasicAuth]
newuser@email.com:newpassword

HTTP/1.1 200
[Asserts]
header "Location" matches "^(http|https):\/\/localhost:8080\/v1\/users\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.user.id" isInteger
jsonpath "$.user.hashedEmail" matches /^[0-9a-fA-F]+$/
jsonpath "$.user.displayName" isString
jsonpath "$.user.profileBio" isString
jsonpath "$.user.profilePictureUrl" exists # These are nullable so this is all we can assert
jsonpath "$.user.profilePictureUrlExpiry" exists

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
