POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Asset for Comments Delete Test",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "half_orc",
    "class": "barbarian",
    "gender": "male",
    "alignment": "chaotic_neutral",
    "appearance": "Scarred and muscular with tusks protruding from lower jaw",
    "personality": "Aggressive but loyal to friends",
    "background": "Raised by a warrior tribe in the mountains",
    "abilities": "Rage, great weapon fighting, intimidation",
    "equipment": "Great axe, hide armor, tribal totems",
    "motivation": "Prove strength and worth to tribe"
  }
}

HTTP 201
[Captures]
asset_uuid: jsonpath "$.asset.uuid"

# Add a comment from user1 (same as asset owner)
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{asset_uuid}}",
  "body": "Comment from user1 (asset owner)"
}

HTTP 201
[Captures]
comment_id_user1: jsonpath "$.comment.id"

# Add another comment from user2
POST http://localhost:8080/v1/comments
[BasicAuth]
user2@email.com:password2
{
  "assetId": "{{asset_uuid}}",
  "body": "Comment from user2"
}

HTTP 201
[Captures]
comment_id_user2: jsonpath "$.comment.id"

# Create a second asset from user2
POST http://localhost:8080/v1/assets
[BasicAuth]
user2@email.com:password2
{
  "name": "User2's Asset for Comments Delete Test",
  "type": "character",
  "visibility": "public",
  "data": {
    "race": "gnome",
    "class": "rogue",
    "gender": "female",
    "alignment": "chaotic_good",
    "appearance": "Small with bright red hair and mischievous eyes",
    "personality": "Curious and always tinkering with gadgets",
    "background": "Street urchin turned master thief",
    "abilities": "Sneak attack, lockpicking, trapfinding",
    "equipment": "Daggers, leather armor, thieves' tools, smoke bombs",
    "motivation": "Collect rare and interesting trinkets"
  }
}

HTTP 201
[Captures]
asset_uuid_user2: jsonpath "$.asset.uuid"

# Add a comment from user1 on user2's asset
POST http://localhost:8080/v1/comments
[BasicAuth]
user1@email.com:password1
{
  "assetId": "{{asset_uuid_user2}}",
  "body": "Comment from user1 on user2's asset"
}

HTTP 201
[Captures]
comment_id_user1_on_user2_asset: jsonpath "$.comment.id"

# 1. Delete a comment as comment author
DELETE http://localhost:8080/v1/comments/{{comment_id_user1}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Comment deleted successfully"

# Verify comment is gone
GET http://localhost:8080/v1/comments?assetId={{asset_uuid}}
HTTP 200
[Asserts]
jsonpath "$.comments[*].id" not includes {{comment_id_user1}}

# 2. Delete a comment as asset owner (even if not comment author)
DELETE http://localhost:8080/v1/comments/{{comment_id_user2}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Comment deleted successfully"

# Verify comment is gone
GET http://localhost:8080/v1/comments?assetId={{asset_uuid}}
HTTP 200
[Asserts]
jsonpath "$.comments" isEmpty

# 3. Try to delete a comment when not the asset owner or comment author
DELETE http://localhost:8080/v1/comments/{{comment_id_user1_on_user2_asset}}
[BasicAuth]
user3@email.com:password3

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 4. Try to delete a non-existent comment
DELETE http://localhost:8080/v1/comments/99999
[BasicAuth]
user1@email.com:password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Comment not found"

# 5. Try to delete without authentication
DELETE http://localhost:8080/v1/comments/{{comment_id_user1_on_user2_asset}}

HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

# 6. Delete as comment author (not asset owner)
DELETE http://localhost:8080/v1/comments/{{comment_id_user1_on_user2_asset}}
[BasicAuth]
user1@email.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Comment deleted successfully"

# Verify comment is gone
GET http://localhost:8080/v1/comments?assetId={{asset_uuid_user2}}
HTTP 200
[Asserts]
jsonpath "$.comments" isEmpty 
