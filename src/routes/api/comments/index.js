/**
 * The entry-point for /comments endpoints
 */

const express = require("express");

const router = express.Router();

router.post(`/`, require("./post"));

router.get(`/`, require("./get"));

router.patch(`/:commentId`, require("./patchById"));

router.delete(`/:commentId`, require("./deleteById"));

module.exports = router;
