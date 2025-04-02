# This test is not idempotent because re-creating assets requires an external API.
# We cannot use external APIs during testing because they may fail.

DELETE http://localhost:8080/v1/assets/6b530b4c-5b56-4a7d-8085-2ac070920176
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Asset deleted successfully"

GET http://localhost:8080/v1/assets/6b530b4c-5b56-4a7d-8085-2ac070920176
[BasicAuth]
user1@email.com:password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"

DELETE http://localhost:8080/v1/assets/6b530b4c-5b56-4a7d-8085-2ac070920176
[BasicAuth]
user1@email.com:password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"

DELETE http://localhost:8080/v1/assets/not-a-uuid
[BasicAuth]
user1@email.com:password1

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

DELETE http://localhost:8080/v1/assets/6b530b4c-5b56-4a7d-8085-2ac070920175

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

DELETE http://localhost:8080/v1/assets/6b530b4c-5b56-4a7d-8085-2ac070920175
[BasicAuth]
user1@email.com:password1

HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"
