const express = require("express");
const { authenticate, optionalAuthenticate } = require("../../../lib/auth");

/**
 * The entry-point for /collections endpoints
 */

const router = express.Router();

router.post(`/`, authenticate(), require("./post"));

router.get(`/`, optionalAuthenticate(), require("./get"));

router.post(
  `/:collectionId/assets`,
  authenticate(),
  require("./addAssetsToCollection"),
);

router.get(`/:collectionId`, optionalAuthenticate(), require("./getById"));

router.patch(`/:collectionId`, authenticate(), require("./patchById"));

router.delete(`/:collectionId`, authenticate(), require("./deleteById"));

module.exports = router;
