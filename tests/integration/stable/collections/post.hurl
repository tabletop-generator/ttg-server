POST {{host}}/v1/collections
HTTP 401

POST {{host}}/v1/collections
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
file,collection.json;
HTTP 201
