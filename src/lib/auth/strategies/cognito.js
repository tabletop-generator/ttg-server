// Configure a JWT token strategy for Passport based on
// Identity Token provided by Cognito. The token will be
// parsed from the Authorization header (i.e., Bearer Token).

const { Strategy: BearerStrategy } = require("passport-http-bearer");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const { authorize, optionalAuthorize } = require("../authorize");
const { logger } = require("../../logger");

// We expect AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be defined.
if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  throw new Error(
    "missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID",
  );
}

// Create a Cognito JWT Verifier, which will confirm that any JWT we
// get from a user is valid and something we can trust. See:
// https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
const jwtVerifier = CognitoJwtVerifier.create({
  // These variables must be set in the .env
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // We expect an Identity Token (vs. Access Token)
  tokenUse: "id",
});

// Later we'll use other auth configurations, so it's important to log what's happening
logger.info("Configured to use AWS Cognito for Authorization");

// At startup, download and cache the public keys (JWKS) we need in order to
// verify our Cognito JWTs, see https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
// You can try this yourself using:
// curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info("Cognito JWKS successfully cached");
  })
  .catch((err) => {
    logger.error({ err, message: err.message }, "Unable to cache Cognito JWKS");
  });

// For our Passport authentication strategy, we'll look for the Bearer Token
// in the Authorization header, then verify that with our Cognito JWT Verifier.
const strategy = new BearerStrategy(async (token, done) => {
  try {
    // Verify this JWT
    const user = await jwtVerifier.verify(token);
    logger.debug({ user }, "Verified user token");

    // Create a user, but only bother with their sub. We could
    // also do a lookup in a database, but we don't need it.
    return done(null, user.sub);
  } catch (err) {
    logger.error(
      { err, message: err.message, token },
      "Could not verify user token",
    );
    return done(null, false);
  }
});

module.exports = {
  strategy,
  authenticate: () => authorize("bearer"),
  optionalAuthenticate: () => optionalAuthorize("bearer"),
};
