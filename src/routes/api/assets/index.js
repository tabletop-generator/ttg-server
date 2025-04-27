const express = require("express");
const { authenticate, optionalAuthenticate } = require("../../../lib/auth");

/**
 * The entry-point for /assets endpoints
 */

const router = express.Router();

router.post(`/`, authenticate(), require("./post"));

router.post(`/:assetId/like`, authenticate(), require("./postLikeById"));

router.get(`/`, optionalAuthenticate(), require("./get"));

router.get(`/:assetId`, optionalAuthenticate(), require("./getById"));

router.patch(`/:assetId`, authenticate(), require("./patchById"));

router.delete(`/:assetId`, authenticate(), require("./deleteById"));

module.exports = router;
