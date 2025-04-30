POST {{host}}/v1/assets/{{user1_public_asset_id}}/comments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,comment.json;
HTTP 201
[Captures]
comment_id: jsonpath "$.commentId"

DELETE {{host}}/v1/comments/{{comment_id}}
HTTP 401

DELETE {{host}}/v1/comments/{{comment_id}}
[BasicAuth]
user2@email.com:password2
HTTP 403

DELETE {{host}}/v1/comments/not_a_valid_id
[BasicAuth]
user1@email.com:password1
HTTP 400

DELETE {{host}}/v1/comments/{{comment_id}}
[BasicAuth]
user1@email.com:password1
HTTP 204
