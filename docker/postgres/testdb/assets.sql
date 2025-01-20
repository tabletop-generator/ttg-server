-- Insert test user
INSERT INTO "User" ("userId", "hashedEmail", "displayName") 
VALUES (1, 'test-user-hash', 'Test User');

-- Insert test assets
INSERT INTO "Asset" ("assetId", "userId", "name", "visibility", "type") 
VALUES 
  (1, 1, 'Test Character', 'public', 'character'),
  (2, 1, 'Test Location', 'public', 'location'),
  (3, 1, 'Private Character', 'private', 'character');

-- Insert character-specific data
INSERT INTO "CharacterAsset" ("assetId", "appearance", "class") 
VALUES (1, 'Tall warrior', 'Fighter');

-- Insert location-specific data
INSERT INTO "LocationAsset" ("assetId", "description", "type") 
VALUES (2, 'A dark cave', 'Dungeon');
