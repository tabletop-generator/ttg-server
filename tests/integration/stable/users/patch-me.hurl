PATCH {{host}}/v1/users/me
HTTP 401

PATCH {{host}}/v1/users/me
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,user.json;
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.displayName" isString
jsonpath "$.bio" isString
