// Prefer Amazon Cognito
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  module.exports = require("./cognito");
}
// Then Supabase Auth
else if (
  process.env.SUPABASE_PROJECT_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  module.exports = require("./supabase");
}
// Allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== "production") {
  module.exports = require("./basic");
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error("missing env vars: no authorization configuration found");
}
