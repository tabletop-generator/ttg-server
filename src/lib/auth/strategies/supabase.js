const { Strategy: BearerStrategy } = require("passport-http-bearer");
const { createClient } = require("@supabase/supabase-js");

const { authorize, optionalAuthorize } = require("../authorize");
const { logger } = require("../../logger");

const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(SUPABASE_PROJECT_URL && SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error(
    "missing expected env vars: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
}

// Create a Supabase admin client for server-side auth verification
const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_ROLE_KEY);

logger.info("Configured to use Supabase Auth for Authorization");

const strategy = new BearerStrategy(async (token, done) => {
  try {
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn({ error }, "Invalid Supabase user token");
      return done(null, false);
    }

    logger.debug({ user }, "Verified Supabase user token");
    return done(null, user.user.id);
  } catch (err) {
    logger.error(
      { err, message: err.message, token },
      "Could not verify Supabase token",
    );
    return done(err, false);
  }
});

module.exports = {
  strategy,
  authenticate: () => authorize("bearer"),
  optionalAuthenticate: () => optionalAuthorize("bearer"),
};
