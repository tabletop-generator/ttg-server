# API Specification

## Assets

An asset's metadata is an object that describes the asset. For example, a character asset is described in the following format:

```json
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
  "pose": "Standing"
}
```

```js
class Asset {
  constructor(
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    name,
    description,
    visibility,
    likes,
    prompt,
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.name = name;
    this.description = description;
    this.visibility = visibility;
    this.likes = likes;
    this.prompt = prompt;
  }
}

class CharacterAsset extends Asset {
  constructor(
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    name,
    description,
    prompt,
    visibility,
    likes,
    gender,
    age,
    build,
    alignment,
    pose,
  ) {
    super(
      id,
      ownerId,
      created,
      updated,
      name,
      description,
      prompt,
      visibility,
      likes,
    );
    this.gender = gender;
    this.age = age;
    this.build = build;
    this.alignment = alignment;
    this.pose = pose;
  }
}

class LocationAsset extends Asset {
  // TBD
}

class QuestAsset extends Asset {
  // TBD
}

class MapAsset extends Asset {
  // TBD
}
```

### `POST /assets`

Generates an asset for the current user (i.e. authenticated user). The client posts the asset parameters in the request body. An Asset object is created to hold asset data - including asset id, user id, name, visibility, creation date, last updated date, type, number of likes, and the generated description (image URL is generated based on user and asset id so doesn't need to be stored). The asset parameters are then used to fill in prompts and send an API call to the image and text generation APIs. The generated image and other asset data are stored.

A successful response returns an HTTP 201. It includes a Location header with a full URL to use in order to access the newly created asset.

### `GET /assets?type=""&desc=""&prompt=""&name=""`

Gets assets created by all users, filtered through query parameters for the asset's type, name, description, and the original prompt.

### `GET /assets/:userId?type=""&desc=""&prompt=""&name=""`

Gets all assets created by a user by their id, filtered through query parameters for the asset's type, name, description, and the original prompt. If a user has no assets, an empty array is returned instead of an error. If the `userId` is not the current user, return only public assets.

If the id does not represent a known user, returns an HTTP 404 with an appropriate error message.

### `GET /assets/:userId/:assetId`

Gets a user's asset with the given `userId` and `assetId`. If the `userId` is not the current user, return only public assets.

If the asset is not public, returns an HTTP 404.

If the ids do not represent a known user and asset, returns an HTTP 404 with an appropriate error message.

### `PATCH /assets/:assetId`

Updates an asset for the current user by it's id. Can update the asset's name, description, and privacy.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

### `DELETE /assets/:assetId`

Deletes an asset for the current user by it's id.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

## Collections

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

```js
class Collection {
  constructor(
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    name,
    visibility,
    assets = [],
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.name = name;
    this.visibility = visibility;
    this.assets = assets;
  }
}
```

### `POST /collections`

Creates a collection for the current user (i.e. authenticated user). The client posts the collection parameters in the request body. A Collection object is created to store collection data.

### `GET /collections/:userId`

Get the user's collections without the list of assets. If the `userId` is not the current user, return only public collections.

If the id does not represent a known user, returns an HTTP 404 with an appropriate error message.

### `GET /collections/:userId/:collectionId`

Get a collection by id with the list of assets.

If the collection is not public, returns an HTTP 404.

If the ids do not represent a known user and collection, returns an HTTP 404 with an appropriate error message.

### `DELETE /collections/:collectionId`

Allows the authenticated user to delete one of their existing collections with the given id.

If the id does not represent a known collection, returns an HTTP 404 with an appropriate error message.

### `PATCH /collections/:collectionId`

Allows the authenticated user to update (i.e., replace) their existing collection with the specified id - add/remove assets, update name/description/privacy

If the id does not represent a known collection, returns an HTTP 404 with an appropriate error message.

## Users

A user's data is stored in an object in the following format:

```json
{
  "id": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
  "joined": "2021-11-02T15:09:50.403Z",
  "displayName": "dkowalski02",
  "bio": "hello"
}
```

```js
class User {
  constructor(
    id = randomUUID(),
    joined = new Date().toISOString(),
    displayName,
    bio,
  ) {
    this.id = id;
    this.joined = joined;
    this.displayName = displayName;
    this.bio = bio;
  }
}
```

### `GET /users/:userId`

Get the user's info by id.

If the id does not represent a known user, returns an HTTP 404 with an appropriate error message.

### `PATCH /users`

Update the current user's info.

## Comments

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

```js
class Comment {
  constructor(
    id = randomUUID(),
    assetId,
    userId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    body,
  ) {
    this.id = id;
    this.assetId = assetId;
    this.userId = userId;
    this.created = created;
    this.updated = updated;
    this.body = body;
  }
}
```

### POST `/comments/:assetId`

Create a comment on an asset.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

### GET `/comments/:assetId`

Get comments for an asset by id.

If the id does not represent a known asset, returns an HTTP 404 with an appropriate error message.

### PATCH `/comments/:assetId/:commentId`

Update a comment for an asset by id.

If the ids do not represent a known asset and comment, returns an HTTP 404 with an appropriate error message.

### DELETE `/comments/:assetId/:commentId`

Delete a comment for an asset by id.

If the ids do not represent a known asset and comment, returns an HTTP 404 with an appropriate error message.

If neither the comment nor the asset belong to the current user, returns an HTTP 403 with an appropriate error message.
