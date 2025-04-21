const BearerStrategy = require("passport-http-bearer").Strategy;
const { createClient } = require("@supabase/supabase-js");
const logger = require("../logger");
const authorize = require("./auth-middleware");

// These must be set securely (not exposed to client)
const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(SUPABASE_PROJECT_URL && SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

// Create a Supabase admin client for server-side auth verification
const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_ROLE_KEY);

logger.info("Configured to use Supabase Auth for Authorization");

module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    try {
      const { data: user, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        logger.warn({ error }, "Invalid Supabase user token");
        return done(null, false);
      }

      logger.debug({ user }, "Verified Supabase user token");
      done(null, user.user.email);
    } catch (err) {
      logger.error({ err, token }, "Could not verify Supabase token");
      done(err, false);
    }
  });

module.exports.authenticate = () => authorize("bearer");
