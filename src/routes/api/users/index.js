const express = require("express");
const auth = require("../../../auth");

/**
 * The entry-point for /users endpoints
 */

const router = express.Router();

router.post(`/`, auth.authenticate(), require("./post"));

router.get(`/:userId`, require("./getById"));

router.patch(`/:userId`, auth.authenticate(), require("./patchById"));

module.exports = router;
