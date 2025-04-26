const express = require("express");
const auth = require("../../../lib/auth");

/**
 * The entry-point for /users endpoints
 */

const router = express.Router();

router.post(`/`, auth.authenticate(), require("./post"));

router.get(`/:userId`, require("./getById"));

router.patch(`/me`, auth.authenticate(), require("./patchMe"));

module.exports = router;
