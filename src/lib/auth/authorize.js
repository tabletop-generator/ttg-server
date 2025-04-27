const passport = require("passport");

const { createHttpError } = require("../error");
const logger = require("../logger");

/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} - the middleware function to use for authentication
 */
function authorize(strategyName) {
  return function (req, res, next) {
    /**
     * Define a custom callback to run after the user has been authenticated
     * where we can modify the way that errors are handled.
     * @param {Error} err - an error object
     * @param {string} user - an authenticated user's id
     */
    function callback(err, user) {
      // Something failed, let the the error handling middleware deal with it
      if (err) {
        logger.warn({ err }, "Error authenticating user");
        return next(createHttpError(500, "Unable to authenticate user"));
      }

      // Not authorized, return a 401
      if (!user) {
        return res.status(401).json(createHttpError(401, "Unauthorized"));
      }

      // Authorized. Attach the user's id to the request and continue
      req.user = user;
      logger.debug(
        { user },
        `Authenticated user with ${strategyName} strategy`,
      );

      // Call the next function in the middleware chain (e.g. your route handler)
      next();
    }

    // Call the given passport strategy's authenticate() method, passing the
    // req, res, next objects.  Invoke our custom callback when done.
    passport.authenticate(strategyName, { session: false }, callback)(
      req,
      res,
      next,
    );
  };
}

/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} - the middleware function to use for authentication
 */
function optionalAuthorize(strategyName = "bearer") {
  return (req, res, next) => {
    passport.authenticate(strategyName, { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }

      // If authentication succeeded, attach user
      if (user) {
        req.user = user;
      }

      // Always continue
      return next();
    })(req, res, next);
  };
}

module.exports = { authorize, optionalAuthorize };
