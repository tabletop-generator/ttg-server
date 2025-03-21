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
 */
router.use(`/v1`, limiter, auth.authenticate(), require("./api"));

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
