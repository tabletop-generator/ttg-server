GET {{host}}/v1/users/not_a_valid_id
HTTP 400

GET {{host}}/v1/users/{{user1_id}}
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
jsonpath "$.displayName" isString
jsonpath "$.bio" isString
