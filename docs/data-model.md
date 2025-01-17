# Tabletop Generator Data Model

## User

```txt
USER [PK userId, hashedEmail, displayName, joinDate, profileBio, profilePictureUrl, profilePictureUrlExpiry]
```

## Asset

```txt
ASSET [PK assetId, FK userId, name, visibility, createdDate, updatedDate, likes, type, imageUrl, imageUrlExpiry]

CHARACTER_ASSET [PK FK assetId, appearance, class, personality, equipment]
LOCATION_ASSET [PK FK assetId, description, type, theme, mood, timeOfDay, pointsOfInterest, lore]
QUEST_ASSET [PK FK assetId, description, objective, reward, difficultyLevel]
MAP_ASSET [PK FK assetId, dimensions, lore, scale, biome]
```

## Comment

```txt
COMMENT [PK commentId, FK assetId, FK userId, createdDate, updatedDate, body]
```

## Collection

```txt
COLLECTION [PK collectionId, FK userId, name, description, createdDate, updatedDate, visibility]
COLLECTION_ASSET [PK FK collectionId, PK FK assetId]
USER_FEATURED_COLLECTIONS [PK FK collectionId, PK FK userId]
```
