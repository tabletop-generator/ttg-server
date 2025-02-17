# Get User by ID (Valid)
GET http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
Accept: application/json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]

jsonpath "$.status" == "ok"
jsonpath "$.user.id" isInteger
jsonpath "$.user.hashedEmail" == "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a"
jsonpath "$.user.displayName" exists # These are nullable so this is all we can assert
jsonpath "$.user.profileBio" exists
jsonpath "$.user.profilePictureUrl" exists
jsonpath "$.user.profilePictureUrlExpiry" exists


# Get User with Non-Existing ID
GET http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca4201
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
[Asserts]
jsonpath "$.error.message" == "User not found"


# Get User with Invalid hash
GET http://localhost:8080/v1/users/111abc222efg111abc222efg111abc222efg111abc222efg111abc222efg111a
Accept: application/json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 400
[Asserts]
jsonpath "$.error.message" == "Invalid hash"


# Get User Without Authorization
GET http://localhost:8080/v1/users/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a
Accept: application/json

HTTP/1.1 401
[Asserts]
jsonpath "$.error.message" == "Unauthorized"
