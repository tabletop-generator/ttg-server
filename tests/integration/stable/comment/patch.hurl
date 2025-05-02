POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 201
[Captures]
comment_id: jsonpath "$.commentId"

PATCH {{host}}/v1/comments/{{comment_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

PATCH {{host}}/v1/comments/not_a_valid_id
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
HTTP 400

PATCH {{host}}/v1/comments/{{comment_id}}
Content-Type: application/json
file,comment.json;
HTTP 401

PATCH {{host}}/v1/comments/{{comment_id}}
Content-Type: application/json
[BasicAuth]
user2@email.com:password2
file,comment.json;
HTTP 403

PATCH {{host}}/v1/comments/{{comment_id}}
[BasicAuth]
user1@email.com:password1
HTTP 415

PATCH {{host}}/v1/comments/{{comment_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 200
[Asserts]
jsonpath "$.userId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.displayName" isString
jsonpath "$.commentId" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.body" isString
jsonpath "$.createdAt" isIsoDate
jsonpath "$.updatedAt" isIsoDate
