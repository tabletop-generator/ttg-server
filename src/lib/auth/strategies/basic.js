const { BasicStrategy } = require("passport-http");
const crypto = require("node:crypto");
const fs = require("node:fs");

const { authorize } = require("../authorize");

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error("missing expected env var: HTPASSWD_FILE");
}

const htpasswdPath = process.env.HTPASSWD_FILE;

const htpasswd = fs
  .readFileSync(htpasswdPath, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [username, hash] = line.split(":");
    return { username, hash };
  });

function findUser(username) {
  return htpasswd.find((u) => u.username === username);
}

function generateUUIDFromUsername(username) {
  // Generate a *consistent UUID* from username (namespaced UUID v5 style)
  const hash = crypto
    .createHash("sha256")
    .update(username)
    .digest("hex")
    .slice(0, 32);

  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    "4" + hash.substring(13, 16), // UUID v4 style tweak
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16) +
      hash.substring(18, 20),
    hash.substring(20, 32),
  ].join("-");
}

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for a
  // username/password pair in the Authorization header.
  new BasicStrategy((username, password, done) => {
    const user = findUser(username);
    if (!user) {
      return done(null, false);
    }

    const userId = generateUUIDFromUsername(username);
    return done(null, userId);
  });

module.exports.authenticate = () => authorize("basic");
