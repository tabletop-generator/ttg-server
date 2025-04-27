const express = require("express");
const { authenticate } = require("../../../lib/auth");

/**
 * The entry-point for /users endpoints
 */

const router = express.Router();

router.post(`/`, authenticate(), require("./post"));

router.get(`/me`, authenticate(), require("./getMe"));

router.get(`/:userId`, require("./getById"));

router.patch(`/me`, authenticate(), require("./patchMe"));

module.exports = router;
