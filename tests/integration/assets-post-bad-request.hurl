POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "type": "character",
  "visibility": "public",
  "data": {
    "name": "Thalor Duskbane"
  }
}

HTTP/1.1 400
