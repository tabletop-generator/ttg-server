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
