const express = require("express");
const auth = require("../../../lib/auth");

/**
 * The entry-point for /comments endpoints
 */

const router = express.Router();

router.post(`/`, auth.authenticate(), require("./post"));

router.get(`/`, require("./get"));

router.patch(`/:commentId`, auth.authenticate(), require("./patchById"));

router.delete(`/:commentId`, auth.authenticate(), require("./deleteById"));

module.exports = router;
