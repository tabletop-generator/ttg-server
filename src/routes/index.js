const { hostname } = require("node:os");
const express = require("express");

// Version from package.json
const { version } = require("../../package.json");

// Success response generator
const { createSuccessResponse } = require("../response");

// Our authentication middleware
const auth = require("../auth");

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Use optional authentication for GET /assets and GET /comments
 */
router.use(
  `/v1`,
  function (req, res, next) {
    // For GET /assets and GET /comments, make authentication optional but still process it if provided
    if (
      (req.method === "GET" && req.path === "/assets") ||
      (req.method === "GET" && req.path.startsWith("/comments"))
    ) {
      // If Authorization header exists, try to authenticate
      if (req.headers.authorization) {
        return auth.authenticate({ failWithError: false })(req, res, next);
      }
      // Otherwise proceed without authentication
      return next();
    }

    // For all other routes, require authentication
    auth.authenticate()(req, res, next);
  },
  require("./api"),
);

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get("/", (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader("Cache-Control", "no-cache");
  // Send a 200 'OK' response with info about our repo
  return res.status(200).json(
    createSuccessResponse({
      githubUrl: "https://github.com/tabletop-generator/ttg-server",
      version,
      hostname: hostname(),
    }),
  );
});

module.exports = router;
