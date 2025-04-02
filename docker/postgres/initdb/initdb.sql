-- Create base asset enums
CREATE TYPE enum_asset_type AS ENUM ('character', 'quest', 'map', 'location');
CREATE TYPE enum_visibility AS ENUM ('public', 'private', 'unlisted');

-- Create character asset enums
CREATE TYPE enum_character_race AS ENUM ('human', 'elf', 'drow', 'half_elf', 'half_orc', 'halfling', 'dwarf', 'gnome', 'tiefling', 'githyanki', 'dragonborn');
CREATE TYPE enum_character_class AS ENUM ('barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard');
CREATE TYPE enum_character_gender AS ENUM ('male', 'female', 'non_binary', 'genderfluid', 'agender');
CREATE TYPE enum_character_alignment AS ENUM ('lawful_good', 'neutral_good', 'chaotic_good', 'lawful_neutral', 'true_neutral', 'chaotic_neutral', 'lawful_evil', 'neutral_evil', 'chaotic_evil');

-- Create User table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "hashed_email" TEXT NOT NULL UNIQUE,
    "join_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" TEXT,
    "profile_bio" TEXT,
    "profile_picture_url" TEXT,
    "profile_picture_url_expiry" TIMESTAMP
);

-- Create Asset table
CREATE TABLE "Asset" (
    "id" SERIAL PRIMARY KEY,
    "uuid" UUID NOT NULL UNIQUE,
    "creator_id" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_featured" BOOLEAN NOT NULL DEFAULT FALSE,
    "likes" INT NOT NULL DEFAULT 0,
    "type" enum_asset_type NOT NULL,
    "visibility" enum_visibility NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "image_url_expiry" TIMESTAMP NOT NULL
);

-- Create Character table
CREATE TABLE "Character" (
    "asset_id" INT PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "race" enum_character_race NOT NULL,
    "class" enum_character_class NOT NULL,
    "gender" enum_character_gender NOT NULL,
    "alignment" enum_character_alignment NOT NULL,
    "abilities" TEXT,
    "appearance" TEXT,
    "background" TEXT,
    "equipment" TEXT,
    "motivation" TEXT,
    "personality" TEXT,
    "custom_description" TEXT
);

-- Create Location table
CREATE TABLE "Location" (
    "asset_id" INT PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "terrain" TEXT,
    "climate" TEXT,
    "atmosphere" TEXT,
    "inhabitants" TEXT,
    "danger_level" TEXT,
    "points_of_interest" TEXT,
    "narrative_role" TEXT,
    "custom_description" TEXT
);

-- Create Quest table
CREATE TABLE "Quest" (
    "asset_id" INT PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "tone" TEXT,
    "location" TEXT,
    "complexity" TEXT,
    "objective" TEXT,
    "antagonist" TEXT,
    "notable_npcs" TEXT,
    "has_combat" BOOLEAN NOT NULL,
    "has_puzzles" BOOLEAN NOT NULL,
    "has_skill_challenges" BOOLEAN NOT NULL,
    "has_dilemmas" BOOLEAN NOT NULL,
    "custom_description" TEXT
);

-- Create Map table
CREATE TABLE "Map" (
    "asset_id" INT PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "scale" TEXT,
    "terrain" TEXT,
    "points_of_interest" TEXT,
    "custom_description" TEXT
);

-- Create Comment table
CREATE TABLE "Comment" (
    "id" SERIAL PRIMARY KEY,
    "asset_id" INT NOT NULL REFERENCES "Asset"("id") ON DELETE CASCADE,
    "author_id" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" TEXT NOT NULL
);

-- Create Collection table
CREATE TABLE "Collection" (
    "id" SERIAL PRIMARY KEY,
    "creator_id" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" enum_visibility NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- Create Asset To Collection many-to-many table
CREATE TABLE "_AssetToCollection" (
    "A" INT NOT NULL REFERENCES "Asset"("id") ON DELETE CASCADE,
    "B" INT NOT NULL REFERENCES "Collection"("id") ON DELETE CASCADE
);

-- Create indices for Prisma implicit many-to-many relation
CREATE UNIQUE INDEX "_AssetToCollection_AB_unique" ON "_AssetToCollection"("A" int4_ops,"B" int4_ops);
CREATE INDEX "_AssetToCollection_B_index" ON "_AssetToCollection"("B" int4_ops);

-- Insert testing users
INSERT INTO "User" (hashed_email) VALUES ('11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a');
INSERT INTO "User" (hashed_email) VALUES ('b0194b2e11548b547ddaff0e105b22347f94b625a7b964d7db72e1658c461a7f');

-- Insert testing assets
-- user1, private
INSERT INTO "Asset" (uuid, creator_id, type, visibility, name, image_url, image_url_expiry) VALUES ('6ef5db05-9a0f-4556-b7b9-bf35744d5174', '1', 'character', 'private', 'User 1 Private Asset', 'http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/eaf3741c-eb64-44bb-b4f6-3b52e211ef27?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=974b561aeb8d0a81be8a82bb5e6647f93f005309040219fe2794e6bcfcb1d325&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.945Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('1', 'elf', 'wizard', 'female', 'neutral_good');

-- user2, public
INSERT INTO "Asset" (uuid, creator_id, type, visibility, name, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920175', '2', 'quest', 'public', 'User 2 Public Asset', 'http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Quest" (asset_id, type, has_combat, has_puzzles, has_skill_challenges, has_dilemmas) VALUES ('2', 'rescue', true, true, false, true);

-- user1, public, gets deleted in asset-deleteById.hurl
INSERT INTO "Asset" (uuid, creator_id, type, visibility, name, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920176', '1', 'character', 'public', 'Asset for testing deletion', 'http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('3', 'drow', 'cleric', 'non_binary', 'chaotic_good');

-- user1, public
INSERT INTO "Asset" (uuid, creator_id, type, visibility, name, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920177', '1', 'character', 'public', 'User 1 Public Asset', 'http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('4', 'human', 'fighter', 'male', 'lawful_good');

-- user1, unlisted
INSERT INTO "Asset" (uuid, creator_id, type, visibility, name, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920178', '1', 'map', 'unlisted', 'User 1 Unlisted Asset', 'http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Map" (asset_id, type, scale) VALUES ('5', 'dungeon', 'large');

-- user2, private
INSERT INTO "Asset" (uuid, creator_id, type, visibility, name, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920179', '2', 'location', 'private', 'User 2 Private Asset', 'http://localhost:9000/ttg/11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Location" (asset_id, type, terrain, climate) VALUES ('6', 'castle', 'mountains', 'cold');


-- Insert testing collection
INSERT INTO "Collection" (creator_id, visibility, name) VALUES ('1', 'public', 'collection1');

-- Add testing assets to collection
INSERT INTO "_AssetToCollection" ("A", "B") VALUES ('1', '1');
INSERT INTO "_AssetToCollection" ("A", "B") VALUES ('2', '1');
