BEGIN;
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
    "id" UUID NOT NULL PRIMARY KEY,
    "join_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 30),
    "bio" TEXT NOT NULL CHECK (char_length(bio) <= 255) DEFAULT ''
);

-- Create Asset table
CREATE TABLE "Asset" (
    "id" UUID NOT NULL UNIQUE PRIMARY KEY,
    "creator_id" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asset_type" enum_asset_type NOT NULL,
    "visibility" enum_visibility NOT NULL,
    "name" TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 30),
    "description" TEXT NOT NULL CHECK (char_length(description) <= 2000),
    "image_url" TEXT NOT NULL,
    "image_url_expiry" TIMESTAMP NOT NULL
);

-- Create Character table
CREATE TABLE "Character" (
    "asset_id" UUID NOT NULL PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "race" enum_character_race NOT NULL,
    "class" enum_character_class NOT NULL,
    "gender" enum_character_gender NOT NULL,
    "alignment" enum_character_alignment NOT NULL,
    "abilities" TEXT NOT NULL CHECK (char_length(abilities) <= 255) DEFAULT '',
    "appearance" TEXT NOT NULL CHECK (char_length(appearance) <= 255) DEFAULT '',
    "background" TEXT NOT NULL CHECK (char_length(background) <= 255) DEFAULT '',
    "equipment" TEXT NOT NULL CHECK (char_length(equipment) <= 255) DEFAULT '',
    "motivation" TEXT NOT NULL CHECK (char_length(motivation) <= 255) DEFAULT '',
    "personality" TEXT NOT NULL CHECK (char_length(personality) <= 255) DEFAULT '',
    "notes" TEXT NOT NULL CHECK (char_length(notes) <= 500) DEFAULT ''
);

-- Create Location table
CREATE TABLE "Location" (
    "asset_id" UUID NOT NULL PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "location_type" TEXT NOT NULL CHECK (char_length(location_type) <= 255),
    "terrain" TEXT NOT NULL CHECK (char_length(terrain) <= 255) DEFAULT '',
    "climate" TEXT NOT NULL CHECK (char_length(climate) <= 255) DEFAULT '',
    "atmosphere" TEXT NOT NULL CHECK (char_length(atmosphere) <= 255) DEFAULT '',
    "inhabitants" TEXT NOT NULL CHECK (char_length(inhabitants) <= 255) DEFAULT '',
    "danger_level" TEXT NOT NULL CHECK (char_length(danger_level) <= 255) DEFAULT '',
    "points_of_interest" TEXT NOT NULL CHECK (char_length(points_of_interest) <= 255) DEFAULT '',
    "narrative_role" TEXT NOT NULL CHECK (char_length(narrative_role) <= 255) DEFAULT '',
    "notes" TEXT NOT NULL CHECK (char_length(notes) <= 500) DEFAULT ''
);

-- Create Quest table
CREATE TABLE "Quest" (
    "asset_id" UUID NOT NULL PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "quest_type" TEXT NOT NULL CHECK (char_length(quest_type) <= 255),
    "tone" TEXT NOT NULL CHECK (char_length(tone) <= 255) DEFAULT '',
    "location" TEXT NOT NULL CHECK (char_length(location) <= 255) DEFAULT '',
    "complexity" TEXT NOT NULL CHECK (char_length(complexity) <= 255) DEFAULT '',
    "objective" TEXT NOT NULL CHECK (char_length(objective) <= 255) DEFAULT '',
    "antagonist" TEXT NOT NULL CHECK (char_length(antagonist) <= 255) DEFAULT '',
    "notable_npcs" TEXT NOT NULL CHECK (char_length(notable_npcs) <= 255) DEFAULT '',
    "has_combat" BOOLEAN NOT NULL,
    "has_puzzles" BOOLEAN NOT NULL,
    "has_skill_challenges" BOOLEAN NOT NULL,
    "has_dilemmas" BOOLEAN NOT NULL,
    "notes" TEXT NOT NULL CHECK (char_length(notes) <= 500) DEFAULT ''
);

-- Create Map table
CREATE TABLE "Map" (
    "asset_id" UUID PRIMARY KEY REFERENCES "Asset"("id") ON DELETE CASCADE,
    "map_type" TEXT NOT NULL CHECK (char_length(map_type) <= 255),
    "scale" TEXT NOT NULL CHECK (char_length(scale) <= 255) DEFAULT '',
    "terrain" TEXT NOT NULL CHECK (char_length(terrain) <= 255) DEFAULT '',
    "points_of_interest" TEXT NOT NULL CHECK (char_length(points_of_interest) <= 255) DEFAULT '',
    "notes" TEXT NOT NULL CHECK (char_length(notes) <= 500) DEFAULT ''
);

-- Create Comment table
CREATE TABLE "Comment" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "asset_id" UUID NOT NULL REFERENCES "Asset"("id") ON DELETE CASCADE,
    "author_id" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 255)
);

-- Create Collection table
CREATE TABLE "Collection" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "creator_id" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" enum_visibility NOT NULL,
    "name" TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 30),
    "description" TEXT NOT NULL CHECK (char_length(description) <= 255) DEFAULT ''
);

-- Create table and indices for tracking Assets liked by Users
-- This can't be an implicit many-to-many relationship in Prisma so we do it this way
CREATE TABLE "AssetLike" (
    "asset_id" UUID NOT NULL REFERENCES "Asset"("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("asset_id", "user_id")
);

CREATE INDEX "AssetLike_user_id_index" ON "AssetLike" ("user_id");
CREATE INDEX "AssetLike_asset_id_index" ON "AssetLike" ("asset_id");

-- Create Asset To Collection many-to-many table
CREATE TABLE "_AssetToCollection" (
    "A" UUID NOT NULL REFERENCES "Asset"("id") ON DELETE CASCADE,
    "B" UUID NOT NULL REFERENCES "Collection"("id") ON DELETE CASCADE
);

-- Create indices for Prisma implicit many-to-many relation
CREATE UNIQUE INDEX "_AssetToCollection_AB_unique" ON "_AssetToCollection"("A", "B");
CREATE INDEX "_AssetToCollection_B_index" ON "_AssetToCollection"("B");

-- Create a generic trigger function for updating updated_at
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER set_asset_updated_at
BEFORE UPDATE ON "Asset"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_comment_updated_at
BEFORE UPDATE ON "Comment"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_collection_updated_at
BEFORE UPDATE ON "Collection"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert testing users
INSERT INTO "User" (id, display_name, bio) VALUES ('2fb918e9-113b-4e3e-b31b-e47ea6941241', 'user_1', '');
INSERT INTO "User" (id, display_name, bio) VALUES ('2fb918e9-113b-4e3e-b31b-e47ea6941242', 'user_2', '');

-- Insert testing assets
-- user1, private
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6ef5db05-9a0f-4556-b7b9-bf35744d5174', '2fb918e9-113b-4e3e-b31b-e47ea6941241', 'character', 'private', 'User 1 Private Asset', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/eaf3741c-eb64-44bb-b4f6-3b52e211ef27?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=974b561aeb8d0a81be8a82bb5e6647f93f005309040219fe2794e6bcfcb1d325&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.945Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('6ef5db05-9a0f-4556-b7b9-bf35744d5174', 'elf', 'wizard', 'female', 'neutral_good');

-- user2, public
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920175', '2fb918e9-113b-4e3e-b31b-e47ea6941242', 'quest', 'public', 'User 2 Public Asset', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Quest" (asset_id, quest_type, has_combat, has_puzzles, has_skill_challenges, has_dilemmas) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920175', 'rescue', true, true, false, true);

-- user1, public, gets deleted in asset-deleteById.hurl
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920176', '2fb918e9-113b-4e3e-b31b-e47ea6941241', 'character', 'public', 'Asset for testing deletion', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920176', 'drow', 'cleric', 'non_binary', 'chaotic_good');

-- user1, public
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920177', '2fb918e9-113b-4e3e-b31b-e47ea6941241', 'character', 'public', 'User 1 Public Asset', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920177', 'human', 'fighter', 'male', 'lawful_good');

-- user1, unlisted
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920178', '2fb918e9-113b-4e3e-b31b-e47ea6941241', 'map', 'unlisted', 'User 1 Unlisted Asset', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Map" (asset_id, map_type, scale) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920178', 'dungeon', 'large');

-- user2, private
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920179', '2fb918e9-113b-4e3e-b31b-e47ea6941242', 'location', 'private', 'User 2 Private Asset', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Location" (asset_id, location_type, terrain, climate) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920179', 'castle', 'mountains', 'cold');

-- user1, public, gets updated in asset-patchById.hurl
INSERT INTO "Asset" (id, creator_id, asset_type, visibility, name, description, image_url, image_url_expiry) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920180', '2fb918e9-113b-4e3e-b31b-e47ea6941241', 'character', 'public', 'Asset for testing updating', '', 'http://localhost:9000/ttg/2fb918e9-113b-4e3e-b31b-e47ea6941241/e4062429-9128-4d7b-9cb1-3e954338c236?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=minio-username%2F20250314%2Fna-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250314T033541Z&X-Amz-Expires=604800&X-Amz-Signature=ba7de972bcef0f4af825ca7ddb993b238af76e5c7085402b2e83ead895394650&X-Amz-SignedHeaders=host&x-id=GetObject', '2025-03-21T03:35:41.989Z');
INSERT INTO "Character" (asset_id, race, class, gender, alignment) VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920180', 'drow', 'cleric', 'non_binary', 'chaotic_good');

-- Insert testing collection
INSERT INTO "Collection" (id, creator_id, visibility, name, description) VALUES ('3ab918e9-113b-4e3e-b31b-e47ea6941247', '2fb918e9-113b-4e3e-b31b-e47ea6941241', 'public', 'collection1', '');

-- Add testing assets to collection
INSERT INTO "_AssetToCollection" ("A", "B") VALUES ('6ef5db05-9a0f-4556-b7b9-bf35744d5174', '3ab918e9-113b-4e3e-b31b-e47ea6941247');
INSERT INTO "_AssetToCollection" ("A", "B") VALUES ('6b530b4c-5b56-4a7d-8085-2ac070920175', '3ab918e9-113b-4e3e-b31b-e47ea6941247');
COMMIT;
