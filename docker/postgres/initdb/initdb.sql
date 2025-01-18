-- Create enums for asset type and visibility
CREATE TYPE asset_type AS ENUM ('character', 'quest', 'map', 'location');
CREATE TYPE visibility_type AS ENUM ('public', 'private', 'unlisted');

-- Create User table
CREATE TABLE "User" (
    "userId" SERIAL PRIMARY KEY,
    "hashedEmail" TEXT NOT NULL UNIQUE,
    "displayName" VARCHAR(100) NOT NULL,
    "joinDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileBio" TEXT,
    "profilePictureUrl" TEXT,
    "profilePictureUrlExpiry" TIMESTAMP
);

-- Create Asset table
CREATE TABLE "Asset" (
    "assetId" SERIAL PRIMARY KEY,
    "userId" INT REFERENCES "User"("userId") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "visibility" visibility_type NOT NULL,
    "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFeatured" BOOLEAN DEFAULT FALSE,
    "likes" INT DEFAULT 0,
    "type" asset_type NOT NULL,
    "imageUrl" TEXT,
    "imageUrlExpiry" TIMESTAMP
);

-- Create Character Asset table
CREATE TABLE "CharacterAsset" (
    "assetId" INT PRIMARY KEY REFERENCES "Asset"("assetId") ON DELETE CASCADE,
    "appearance" TEXT,
    "class" VARCHAR(50),
    "personality" TEXT,
    "equipment" TEXT
);

-- Create Location Asset table
CREATE TABLE "LocationAsset" (
    "assetId" INT PRIMARY KEY REFERENCES "Asset"("assetId") ON DELETE CASCADE,
    "description" TEXT,
    "type" VARCHAR(50),
    "theme" VARCHAR(50),
    "mood" VARCHAR(50),
    "timeOfDay" VARCHAR(50),
    "pointsOfInterest" TEXT,
    "lore" TEXT
);

-- Create Quest Asset table
CREATE TABLE "QuestAsset" (
    "assetId" INT PRIMARY KEY REFERENCES "Asset"("assetId") ON DELETE CASCADE,
    "description" TEXT,
    "objective" TEXT,
    "reward" TEXT,
    "difficultyLevel" VARCHAR(50)
);

-- Create Map Asset table
CREATE TABLE "MapAsset" (
    "assetId" INT PRIMARY KEY REFERENCES "Asset"("assetId") ON DELETE CASCADE,
    "dimensions" VARCHAR(50),
    "lore" TEXT,
    "scale" VARCHAR(50),
    "biome" VARCHAR(50)
);

-- Create Comment table
CREATE TABLE "Comment" (
    "commentId" SERIAL PRIMARY KEY,
    "assetId" INT REFERENCES "Asset"("assetId") ON DELETE CASCADE,
    "userId" INT REFERENCES "User"("userId") ON DELETE CASCADE,
    "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" TEXT NOT NULL
);

-- Create Collection table
CREATE TABLE "Collection" (
    "collectionId" SERIAL PRIMARY KEY,
    "userId" INT REFERENCES "User"("userId") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" visibility_type NOT NULL
);

-- Create Collection Asset table
CREATE TABLE "CollectionAsset" (
    "collectionId" INT REFERENCES "Collection"("collectionId") ON DELETE CASCADE,
    "assetId" INT REFERENCES "Asset"("assetId") ON DELETE CASCADE,
    PRIMARY KEY ("collectionId", "assetId")
);
