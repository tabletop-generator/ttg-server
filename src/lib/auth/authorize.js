const passport = require("passport");

const { createErrorResponse } = require("../response");
const logger = require("../logger");

/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} - the middleware function to use for authentication
 */
module.exports.authorize = (strategyName) => {
  return function (req, res, next) {
    /**
     * Define a custom callback to run after the user has been authenticated
     * where we can modify the way that errors are handled.
     * @param {Error} err - an error object
     * @param {string} id - an authenticated user's id
     */
    function callback(err, id) {
      // Something failed, let the the error handling middleware deal with it
      if (err) {
        logger.warn({ err }, "Error authenticating user");
        return next(createErrorResponse(500, "Unable to authenticate user"));
      }

      // Not authorized, return a 401
      if (!id) {
        return res.status(401).json(createErrorResponse(401, "Unauthorized"));
      }

      // Authorized. Attach the user's id to the request and continue
      req.user = id;
      logger.debug({ id }, `Authenticated user with ${strategyName} strategy`);

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
};
