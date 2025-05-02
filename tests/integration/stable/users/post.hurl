POST {{host}}/v1/users
HTTP 401

POST {{host}}/v1/users
[BasicAuth]
user1@email.com:password1
HTTP 200

POST {{host}}/v1/users
[BasicAuth]
newuser@email.com:newpassword
HTTP *
[Asserts]
status >= 200
status <= 201
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.displayName" isString
jsonpath "$.bio" isString
