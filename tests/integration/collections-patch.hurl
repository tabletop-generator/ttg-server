# 1. Update the collection's name, description, and visibility, and remove assets from it
PATCH http://localhost:8080/v1/collections/1
[BasicAuth]
user1@email.com:password1
{
  "name": "User 1's Collection",
  "description": "This is User 1's collection",
  "visibility": "unlisted",
  "assetsToRemove": ["6ef5db05-9a0f-4556-b7b9-bf35744d5174", "6b530b4c-5b56-4a7d-8085-2ac070920175"]
}

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collection.id" isInteger
jsonpath "$.collection.ownerId" == "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a"
jsonpath "$.collection.createdAt" isIsoDate
jsonpath "$.collection.updatedAt" isIsoDate
jsonpath "$.collection.description" == "This is User 1's collection"
jsonpath "$.collection.name" == "User 1's Collection"
jsonpath "$.collection.visibility" == "unlisted"
jsonpath "$.collection.assets" isCollection
jsonpath "$.collection.assets" isEmpty


# 2. Add the assets back
PATCH http://localhost:8080/v1/collections/1
[BasicAuth]
user1@email.com:password1
{
  "assetsToAdd": ["6ef5db05-9a0f-4556-b7b9-bf35744d5174", "6b530b4c-5b56-4a7d-8085-2ac070920175"]
}

# Assert that the assets are in the collection
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.collection.assets" isCollection
jsonpath "$.collection.assets[?(@.uuid == '6ef5db05-9a0f-4556-b7b9-bf35744d5174')].uuid" exists
jsonpath "$.collection.assets[?(@.uuid == '6b530b4c-5b56-4a7d-8085-2ac070920175')].uuid" exists


# 3. Try modifying another user's collection
PATCH http://localhost:8080/v1/collections/1
[BasicAuth]
user2@email.com:password2
{
  "name": "User 2's collection",
  "description": "This is now User 2's collection"
}

HTTP/1.1 404
[Asserts]
jsonpath "$.status" == "error"
