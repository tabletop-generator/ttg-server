### 1. Successful Update of the User
PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1

{
  "displayName": "New Display Name",
  "profileBio": "This is my updated bio."
}
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.user.displayName" == "New Display Name"
jsonpath "$.user.profileBio" == "This is my updated bio."

### 2. Invalid Request: Empty displayName (must be at least 1 character)
PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1

{
  "displayName": ""
}
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid request format"

### 3. Invalid Request: profileBio Exceeding Maximum Length
# Create a string with 501 characters
PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1

{
  "profileBio": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Invalid request format"

### 4. Unauthorized Update (No Authentication Provided)
PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a

{
  "displayName": "Unauthorized Name",
  "profileBio": "Unauthorized bio."
}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user2@email.com:password2

{
  "displayName": "Other username",
  "profileBio": "other users bio."
}
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"
