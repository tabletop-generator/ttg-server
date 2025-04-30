POST {{host}}/v1/assets
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,character.json;
HTTP 201
[Captures]
asset_id: jsonpath "$.assetId"

DELETE {{host}}/v1/assets/not_a_valid_id
[BasicAuth]
user1@email.com:password1
HTTP 400

DELETE {{host}}/v1/assets/{{asset_id}}
HTTP 401

DELETE {{host}}/v1/assets/{{asset_id}}
[BasicAuth]
user2@email.com:password2
HTTP 403

DELETE {{host}}/v1/assets/{{asset_id}}
[BasicAuth]
user1@email.com:password1
HTTP 204
