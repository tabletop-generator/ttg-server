# Test GET /assets endpoints

# 1. Get all public assets (should succeed)
GET http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" exists

# 2. Get assets with expand=true (should return full objects)
GET http://localhost:8080/v1/assets?expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[*]" exists
jsonpath "$.assets[*].id" exists
jsonpath "$.assets[*].uuid" exists
jsonpath "$.assets[*].creatorId" exists
jsonpath "$.assets[*].created" exists
jsonpath "$.assets[*].updated" exists
jsonpath "$.assets[*].isFeatured" exists
jsonpath "$.assets[*].likes" exists
jsonpath "$.assets[*].type" exists
jsonpath "$.assets[*].visibility" exists
jsonpath "$.assets[*].name" exists

# 3. Get character assets only
GET http://localhost:8080/v1/assets?type=character&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[*].type" exists
jsonpath "$.assets[*].character" exists

# 4. Get assets by userId
GET http://localhost:8080/v1/assets?userId=1&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[*]" exists
jsonpath "$.assets[*].creatorId" exists
jsonpath "$.assets[0].creatorId" == 1

# 5. Get assets by visibility
GET http://localhost:8080/v1/assets?visibility=public&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[*].visibility" == "public"

# 6. Test name search
GET http://localhost:8080/v1/assets?name=Test&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[*]" exists

# 7. Test unauthorized access
GET http://localhost:8080/v1/assets
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
