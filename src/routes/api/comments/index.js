const express = require("express");

/**
 * The entry-point for /comments endpoints
 */

const router = express.Router();

router.post(`/`, require("./post"));

router.get(`/`, require("./get"));

router.patch(`/:commentId`, require("./patchById"));

router.delete(`/:commentId`, require("./deleteById"));

module.exports = router;
