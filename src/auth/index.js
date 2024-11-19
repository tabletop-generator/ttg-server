// Allow for an .htpasswd file to be used, but not in production
if (process.env.HTPASSWD_FILE && process.NODE_ENV !== "production") {
  module.exports = require("./basic-auth");
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error("missing env vars: no authorization configuration found");
}
