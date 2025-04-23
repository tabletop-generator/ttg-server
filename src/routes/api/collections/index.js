const express = require("express");
const auth = require("../../../lib/auth");

/**
 * The entry-point for /collections endpoints
 */

const router = express.Router();

router.post(`/`, auth.authenticate(), require("./post"));

router.get(`/`, require("./get"));

router.get(`/:collectionId`, require("./getById"));

router.patch(`/:collectionId`, auth.authenticate(), require("./patchById"));

router.delete(`/:collectionId`, auth.authenticate(), require("./deleteById"));

module.exports = router;
