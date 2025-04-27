const express = require("express");
const auth = require("../../../lib/auth");

/**
 * The entry-point for /assets endpoints
 */

const router = express.Router();

router.post(`/`, auth.authenticate(), require("./post"));

router.post(`/:assetId/like`, auth.authenticate(), require("./postLikeById"));

router.get(`/`, auth.optionalAuthenticate(), require("./get"));

router.get(`/:assetId`, auth.optionalAuthenticate(), require("./getById"));

router.patch(`/:assetId`, auth.authenticate(), require("./patchById"));

router.delete(`/:assetId`, auth.authenticate(), require("./deleteById"));

module.exports = router;
