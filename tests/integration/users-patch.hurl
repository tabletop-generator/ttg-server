GET http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
HTTP 200
[Captures]
initial_display_name: jsonpath "$.user.displayName"
initial_bio: jsonpath "$.user.profileBio"
initial_avatar: jsonpath "$.user.profilePictureUrl"


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: Updated Display Name
profileBio: New bio content
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.user.displayName" == "Updated Display Name"
jsonpath "$.user.profileBio" == "New bio content"


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: User With Avatar
profilePicture: file,../resources/test-avater.png; image/png
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.user.displayName" == "User With Avatar"
jsonpath "$.user.profilePictureUrl" exists

PATCH http://localhost:8080/v1/users
[MultipartFormData]
displayName: Should Fail
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:wrongpassword
[MultipartFormData]
displayName: Should Fail
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profilePicture: file,../resources/invalid.txt; text/plain
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: Valid Name
invalidField: Should not be here
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
displayName: Partial Update Only
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.user.displayName" == "Partial Update Only"
jsonpath "$.user.profileBio" == {{initial_bio}}
jsonpath "$.user.profilePictureUrl" exists


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profileBio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident..."
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400


PATCH http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
[BasicAuth]
user1@email.com:password1
[MultipartFormData]
profilePicture: null
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.user.profilePictureUrl" == null
