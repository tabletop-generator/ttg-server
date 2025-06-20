const passport = require("passport");

const { prisma } = require("../../model/data/prismaClient");
const { createHttpError } = require("../error");
const { logger } = require("../logger");

async function ensureUserRecord(userId) {
  if (!userId) throw new Error("No userId provided");

  try {
    let userRecord = await prisma.user.findUnique({
      where: { userId },
    });

    if (!userRecord) {
      userRecord = await prisma.user.create({
        data: {
          userId,
          displayName: `User ${userId.slice(0, 6)}`,
        },
      });
      logger.info({ userId }, "Auto-created user profile");
    }

    return userRecord;
  } catch (error) {
    logger.error({ error, userId }, "Error ensuring user record");
    throw error;
  }
}

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
     * @param {string} userId - an authenticated user's id
     */
    async function callback(err, userId) {
      // Something failed, let the the error handling middleware deal with it
      if (err) {
        logger.warn({ err }, "Error authenticating user");
        return next(createHttpError(500, "Unable to authenticate user"));
      }

      // Not authorized, return a 401
      if (!userId) {
        return next(createHttpError(401, "Unauthorized"));
      }

      // Authorized. Attach the user's id to the request and continue
      req.user = userId;
      logger.debug(
        { user: userId },
        `Authenticated user with ${strategyName} strategy`,
      );

      try {
        await ensureUserRecord(userId);
      } catch (error) {
        logger.error({ error }, "Error syncing user profile");
        return next(createHttpError(500, "User profile sync failed"));
      }

      return next();
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
function optionalAuthorize(strategyName) {
  return function (req, res, next) {
    async function callback(err, userId) {
      if (err) {
        logger.warn({ err }, "Error authenticating user");
        return next(createHttpError(500, "Unable to authenticate user"));
      }

      // If authentication succeeded, attach user
      if (!userId) {
        return next();
      }

      req.user = userId;
      logger.debug(
        { user: userId },
        `Authenticated user with ${strategyName} strategy`,
      );

      try {
        await ensureUserRecord(userId);
      } catch (error) {
        logger.error({ error }, "Error syncing user profile");
        return next(createHttpError(500, "User profile sync failed"));
      }

      // Always continue
      return next();
    }

    passport.authenticate(strategyName, { session: false }, callback)(
      req,
      res,
      next,
    );
  };
}

module.exports = { authorize, optionalAuthorize };
