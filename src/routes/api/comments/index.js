const express = require("express");
const { authenticate } = require("../../../lib/auth");

/**
 * The entry-point for /comments endpoints
 */

const router = express.Router();

router.post(`/`, authenticate(), require("./post"));

router.get(`/`, require("./get"));

router.patch(`/:commentId`, authenticate(), require("./patchById"));

router.delete(`/:commentId`, authenticate(), require("./deleteById"));

module.exports = router;
