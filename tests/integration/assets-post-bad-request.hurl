# Missing property on base object
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

# Missing properties on type-specific data
POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1
{
  "name": "Thalor Duskbane",
  "type": "character",
  "visibility": "public",
  "data": {
    "appearance": "Ash-gray skin, glowing red eyes, long black horns that curl back, dressed in a dark crimson cloak with intricate silver embroidery."
  }
}

HTTP/1.1 400
