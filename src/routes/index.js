const express = require("express");

// version and author from package.json
const { version } = require("../../package.json");

// Success response generator
const { createSuccessResponse } = require("../response");

// Create a router that we can use to mount our API
const router = express.Router();

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
router.get("/", (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader("Cache-Control", "no-cache");
  // Send a 200 'OK' response with info about our repo
  return res.status(200).json(
    createSuccessResponse({
      githubUrl: "https://github.com/tabletop-generator/server",
      version,
    }),
  );
});

module.exports = router;
