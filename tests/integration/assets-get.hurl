# First create test data
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "type": "character",
  "visibility": "public",
  "data": {
    "name": "Thalor Duskbane",
    "race": "tiefling",
    "class": "warlock",
    "gender": "male",
    "alignment": "neutral_evil",
    "appearance": "Ash-gray skin, glowing red eyes",
    "personality": "Manipulative and cunning",
    "background": "Born to a cursed bloodline",
    "abilities": "Eldritch blast",
    "equipment": "Obsidian staff",
    "motivation": "Seek power"
  }
}
HTTP 201

# Now test GET endpoints

# 1. Get all public assets (should succeed)
GET http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" isCollection

# 2. Get assets with expand=true (should return full objects)
GET http://localhost:8080/v1/assets?expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" isCollection
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
jsonpath "$.assets" isCollection
jsonpath "$.assets[0].type" == "character"
jsonpath "$.assets[0].name" == "Thalor Duskbane"
jsonpath "$.assets[0].character.race" == "tiefling"
jsonpath "$.assets[0].character.class" == "warlock"

# 4. Get assets by visibility
GET http://localhost:8080/v1/assets?visibility=public&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" isCollection
jsonpath "$.assets[0].visibility" == "public"

# 5. Get assets by name search
GET http://localhost:8080/v1/assets?name=Thalor&expand=true
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.assets" isCollection
jsonpath "$.assets[0].name" contains "Thalor"

# 6. Test unauthorized access
GET http://localhost:8080/v1/assets
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
