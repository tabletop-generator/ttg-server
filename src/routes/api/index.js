const express = require("express");

/**
 * The main entry-point for the v1 version of the Tabletop Generator API.
 */

// Create a router on which to mount our API endpoints
const router = express.Router();

router.use(`/assets`, require("./assets"));

router.use(`/collections`, require("./collections"));

router.use(`/comments`, require("./comments"));

router.use(`/users`, require("./users"));

module.exports = router;
