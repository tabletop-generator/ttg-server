const express = require("express");

/**
 * The entry-point for /collections endpoints
 */

const router = express.Router();

router.post(`/`, require("./post"));

router.get(`/`, require("./get"));

router.get(`/:collectionId`, require("./getById"));

router.patch(`/:collectionId`, require("./patchById"));

router.delete(`/:collectionId`, require("./deleteById"));

module.exports = router;
