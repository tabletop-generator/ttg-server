GET {{host}}/v1/users/me
HTTP 401

GET {{host}}/v1/users/me
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.displayName" isString
jsonpath "$.bio" isString
