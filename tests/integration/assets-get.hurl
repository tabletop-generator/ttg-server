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
jsonpath "$.assets[*].name" exists
jsonpath "$.assets[*].type" exists

# 3. Get character assets only
GET http://localhost:8080/v1/assets?type=character&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" count == 2
jsonpath "$.assets[0].type" == "character"
jsonpath "$.assets[0].name" == "Test Character"
jsonpath "$.assets[0].visibility" == "public"
jsonpath "$.assets[0].appearance" == "Tall warrior"
jsonpath "$.assets[0].class" == "Fighter"
jsonpath "$.assets[1].type" == "character"
jsonpath "$.assets[1].name" == "Private Character"
jsonpath "$.assets[1].visibility" == "private"

# 4. Get assets by userId
GET http://localhost:8080/v1/assets?userId=1&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets[*]" exists
jsonpath "$.assets[*].ownerId" exists
jsonpath "$.assets[0].ownerId" == 1

# 5. Get single asset by ID
GET http://localhost:8080/v1/assets/1
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.asset.id" exists
jsonpath "$.asset.type" == "character"
jsonpath "$.asset.name" == "Test Character"

# 6. Test invalid asset ID
GET http://localhost:8080/v1/assets/999999
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404

# 7. Test invalid asset ID format
GET http://localhost:8080/v1/assets/not-a-number
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
