GET http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
HTTP 200
[Captures]
initial_display_name: jsonpath "$.user.displayName"
initial_bio: jsonpath "$.user.profileBio"

PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: Updated Display Name
profileBio: New bio content
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.user.displayName" == "Updated Display Name"
jsonpath "$.user.profileBio" == "New bio content"

PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profilePicture: file,tests/resources/test-avatar.png; image/png
displayName: User With Avatar
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.user.profilePictureUrl" exists
jsonpath "$.user.displayName" == "User With Avatar"

# 3. Update non-authenticated user
PATCH http://localhost:8080/v1/users
[MultipartFormData]
displayName: Should Fail
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 4. Update with invalid credentials
PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:wrongpassword
[MultipartFormData]
displayName: Should Fail
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401

# 5. Update with invalid file type
PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profilePicture: file,tests/resources/invalid.txt; text/plain
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

# 6. Update with extra fields
PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: Valid Name
invalidField: Should not be here
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

# 7. Partial update (keep existing values)
PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: Partial Update Only
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.user.displayName" == "Partial Update Only"
jsonpath "$.user.profileBio" == "New bio content"  # From previous update
jsonpath "$.user.profilePictureUrl" exists  # From previous update

# 8. Update with long bio (>500 chars)
PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profileBio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident..."
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

# 9. Remove profile picture
PATCH http://localhost:8080/v1/users
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profilePicture: null
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.user.profilePictureUrl" == null
