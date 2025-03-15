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
