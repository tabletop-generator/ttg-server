# Tabletop Generator Server Specification

## 1. API Version

This is the first version of the Tabletop Generator API, and all URL endpoints discussed below begin with the current version: `/v1/*`. Defining such a version gives flexibility to change the API at a later date, while still supporting older versions in parallel.

## 2. Authentication

Most API routes discussed below require either [Basic HTTP credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication), or a [JSON Web Token (JWT)](https://jwt.io/) to be sent along with each request in the Authorization header.

## 3. Responses

Most responses from the API are returned in JSON format (`application/json`) unless otherwise specified.

Responses also include an extra `status` property, which indicates whether the request was successful (i.e., `'ok'`) or produced an error (`'error'`).

### 3.1 Example: successful response

Successful responses use an HTTP `2xx` status and always include a `"status": "ok"` property/value:

```json
{
  "status": "ok"
}
```

If a response includes other data, it will be included along with the `status`, for example:

```json
{
  "status": "ok",
  "collection": {
    "id": "30a84843-0cd4-4975-95ba-b96112aea189",
    "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    "created": "2021-11-02T15:09:50.403Z",
    "updated": "2021-11-02T15:09:50.403Z",
    "name": "My Collection",
    "visibility": "public",
    "assets": [
      "30a84843-0cd4-4975-95ba-b96112aea189",
      "40a84843-0cd4-4975-95ba-b96112aea189"
    ]
  }
}
```

### 3.2 Example: error response

Error responses use an appropriate HTTP `4xx` (client error) or `5xx` (server error), and include an `error` object, which has both the error `code` (a `number`) and a human readable error `message` (a `string`).

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "invalid request"
  }
}
```

## 4. API

### 4.1 Health Check

An unauthenticated `/` route is available for checking the health of the service. If the service is running, it returns an HTTP `200` status along with the following body:

```json
{
  "status": "ok",
  "githubUrl": "https://github.com/tabletop-generator/ttg-server",
  "version": "version from package.json",
  "hostname": "the host computer's domain name"
}
```

### 4.2 Assets

#### 4.2.1 `POST /assets`

Generates an asset for the current user (i.e. authenticated user). The asset parameters are used to fill in prompts and send an API call to the image and text generation APIs. The generated image and other asset data are stored. A presigned URL for the image is created and stored along with it's expiration timestamp.

A successful response returns an HTTP `201`. It includes a `Location` header with a full URL to use in order to access the newly created asset, for example: Location: https://ttg-api.com/v1/assets/30a84843-0cd4-4975-95ba-b96112aea189. See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.30.

##### Request

```json
{
  "type": "character",
  "visibility": "public",
  "data": {
    "name": "Thalor Duskbane",
    "race": "tiefling",
    "class": "warlock",
    "gender": "male",
    "alignment": "neutral_evil",
    "appearance": "Ash-gray skin, glowing red eyes, long black horns that curl back, dressed in a dark crimson cloak with intricate silver embroidery.",
    "personality": "Manipulative, cunning, and deeply ambitious. Thalor is charismatic but hides a volatile temper.",
    "background": "Born to a cursed bloodline, Thalor made a pact with an ancient fiend to escape his family's downfall. He now roams the world seeking forbidden knowledge and power.",
    "abilities": "Eldritch blast, dark pact magic, charisma-based deception, summoning minor fiends.",
    "equipment": "A jagged obsidian staff that pulses with a faint red glow, a spell tome bound in cracked leather, and a vial of fiendish ichor.",
    "motivation": "To ascend to ultimate power and break free from his fiendish master's control."
  }
}
```

##### Response

```json
{
  "id": 12,
  "uuid": "a4237e17-3d05-442a-b114-c86a466a0a45",
  "creatorId": 1,
  "createdAt": "2025-01-25T23:08:51.886Z",
  "updatedAt": "2025-01-25T23:08:51.886Z",
  "isFeatured": false,
  "likes": 0,
  "type": "character",
  "visibility": "public",
  "name": "Thalor Duskbane",
  "description": "Thalor Duskbane is a walking paradox: a creature of infernal beauty and chilling ambition. His ash-gray skin, a testament to his tiefling heritage, is set off by the piercing red glow of his eyes, burning with a hunger for power...",
  "imageUrl": "http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/a4237e17-3d05-442a-b114-c86a466a0a45?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250125%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250125T230851Z&X-Amz-Expires=900&X-Amz-Signature=246347ff33061e0038a9bff6e135ff01395d6282bf230f27a074f33b556a8b8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  "imageUrlExpiry": "2025-02-01T23:08:51.878Z"
}
```

#### 4.2.2 `GET /assets`

Query Parameters: `name`, `desc`, `type`, `prompt`, `expand`, `userId`

Gets a list of all public assets filtered by the asset's type, name, description, the creator's user id, and the original prompt.

If the image's presigned URL is expired, get a new URL, save it to the db, and return it in the response. Else, return existing presigned URL.

If no assets are found, an empty array is returned instead of an error.

```json
{
  "status": "ok",
  "assets": [
    "b9e7a264-630f-436d-a785-27f30233faea",
    "dad25b07-8cd6-498b-9aaf-46d358ea97fe"
  ]
}
```

If `expand` is `true`, returns the full asset objects instead of just the IDs:

```json
{
  "status": "ok",
  "assets": [
    {
      "id": "30a84843-0cd4-4975-95ba-b96112aea189",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "name": "Gilbert",
      "description": "Dwarf guy",
      "visibility": "unlisted",
      "likes": 0,
      "prompt": "A dwarf guy",
      "gender": "Male",
      "age": "Middle-aged",
      "build": "Muscular",
      "alignment": "True Neutral",
      "pose": "Standing",
      "imageUrl": "https://bucket-name.s3.amazonaws.com/object-key?AWSAccessKeyId=AKIA...&Expires=...&Signature=...",
      "imageUrlExpiry": "2025-01-13T15:30:00Z"
    },
    {
      "id": "40a84843-0cd4-4975-95ba-b96112aea189",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "name": "John",
      "description": "Knight",
      "visibility": "public",
      "likes": 0,
      "prompt": "A knight guy",
      "gender": "Male",
      "age": "Middle-aged",
      "build": "Muscular",
      "alignment": "Neutral Good",
      "pose": "Standing",
      "imageUrl": "https://bucket-name.s3.amazonaws.com/object-key?AWSAccessKeyId=AKIA...&Expires=...&Signature=...",
      "imageUrlExpiry": "2025-01-13T15:30:00Z"
    }
  ]
}
```

If `userId` is the current user, also returns private and unlisted assets.

If `userId` is supplied and does not represent a known user, returns an HTTP 404 with an appropriate error message.

#### 4.2.3 `GET /assets/:assetId`

Gets an asset by the given `assetId`.

If image presigned URL is expired, get a new URL, save it to the db, and return it in the response. Else, return existing presigned URL.

If the asset does not belong to the current user and is not public, returns an HTTP 403.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

#### 4.2.4 `PATCH /assets/:assetId`

Updates an asset for the current user by it's id. Can update the asset's name, description, and visibility.

If the asset does not belong to the current user, returns an HTTP 403.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

#### 4.2.5 `DELETE /assets/:assetId`

Deletes an asset for the current user by it's id.

If the asset does not belong to the current user, returns an HTTP 403.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

### 4.3 Collections

A collection's data is stored in an object in the following format:

```json
{
  "id": "30a84843-0cd4-4975-95ba-b96112aea189",
  "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
  "created": "2021-11-02T15:09:50.403Z",
  "updated": "2021-11-02T15:09:50.403Z",
  "name": "My Collection",
  "visibility": "public",
  "assets": [
    "30a84843-0cd4-4975-95ba-b96112aea189",
    "40a84843-0cd4-4975-95ba-b96112aea189"
  ]
}
```

#### 4.3.1 `POST /collections`

Creates a collection for the current user (i.e. authenticated user). The client posts the collection parameters in the request body. A Collection object is created to store collection data.

#### 4.3.2 `GET /collections`

Query Parameters: `name`, `userId`, `expand`

Gets a list of all public collections from all users, filtered by name and the creator's user id.

```json
{
  "status": "ok",
  "collections": [
    "b9e7a264-630f-436d-a785-27f30233faea",
    "dad25b07-8cd6-498b-9aaf-46d358ea97fe"
  ]
}
```

If `expand` is `true`, returns the full collection objects instead of just the IDs:

```json
{
  "status": "ok",
  "collections": [
    {
      "id": "30a84843-0cd4-4975-95ba-b96112aea189",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "name": "My Collection",
      "visibility": "public",
      "assets": [
        "30a84843-0cd4-4975-95ba-b96112aea189",
        "40a84843-0cd4-4975-95ba-b96112aea189"
      ]
    }
  ]
}
```

If `userId` is the current user, also returns private and unlisted collections.

If `userId` is supplied and does not represent a known user, returns an HTTP 404 with an appropriate error message.

#### 4.3.3 `GET /collections/:collectionId`

Get a collection by the given `collectionId`.

If the collection does not belong to the current user and is not public, returns an HTTP 403.

If the id does not represent a known collection, returns an HTTP 404 with an appropriate error message.

#### 4.3.4 `PATCH /collections/:collectionId`

Updates a collection for the current user by it's id. Can add/remove assets, and update name/description/visibility.

If the id does not represent a known collection, returns an HTTP 404 with an appropriate error message.

#### 4.3.5 `DELETE /collections/:collectionId`

Allows the authenticated user to delete one of their existing collections with the given id.

If the id does not represent a known collection, returns an HTTP 404 with an appropriate error message.

### 4.4 Users

A user's data is stored in an object in the following format:

```json
{
  "id": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
  "joined": "2021-11-02T15:09:50.403Z",
  "displayName": "dkowalski02",
  "bio": "hello",
  "featuredCollections": [
    "30a84843-0cd4-4975-95ba-b96112aea189",
    "40a84843-0cd4-4975-95ba-b96112aea189"
  ]
}
```

#### 4.4.1 `POST /users`

Check if the current user exists. If not, create a record for the user.

#### 4.4.2 `GET /users/:userId`

Get the user's info by id.

If the id does not represent a known user, returns an HTTP 404 with an appropriate error message.

#### 4.4.2 `PATCH /users`

Update the current user's info. displayName, bio, and featuredCollections can be updated.

### 4.5 Comments

A comment's data is stored in an object in the following format:

```json
{
  "id": "30a84843-0cd4-4975-95ba-b96112aea189",
  "assetId": "40a84843-0cd4-4975-95ba-b96112aea189",
  "userId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
  "created": "2021-11-02T15:09:50.403Z",
  "updated": "2021-11-02T15:09:50.403Z",
  "body": "hello"
}
```

#### 4.5.1 `POST /comments`

Create a comment on an asset.

If the asset id does not represent a known asset, returns an HTTP 400 with an appropriate error message.

#### 4.5.2 `GET /comments`

Query Parameters: `assetId` (required)

Get comments for an asset.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

If the asset id is not supplied, returns an HTTP 400 with an appropriate error message.

#### 4.5.3 `PATCH /comments/:commentId`

Update a comment for an asset by id.

If the id does not represent a known comment, returns an HTTP 404 with an appropriate error message.

#### 4.5.4 `DELETE /comments/:commentId`

Delete a comment for an asset by id. Both the asset owner and the commenting user can delete a comment.

If the id does not represent a known comment, returns an HTTP 404 with an appropriate error message.

If neither the comment nor the asset belong to the current user, returns an HTTP 403 with an appropriate error message.
