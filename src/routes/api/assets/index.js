const express = require("express");

/**
 * The entry-point for /assets endpoints
 */

const router = express.Router();

router.post(`/`, require("./post"));

router.get(`/`, require("./get"));

router.get(`/:assetId`, require("./getById"));

router.patch(`/:assetId`, require("./patchById"));

router.delete(`/:assetId`, require("./deleteById"));

module.exports = router;
