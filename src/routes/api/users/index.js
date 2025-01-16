const express = require("express");

/**
 * The entry-point for /users endpoints
 */

const router = express.Router();

router.post(`/`, require("./post"));

router.get(`/:userId`, require("./getById"));

router.patch(`/:userId`, require("./patch"));

module.exports = router;
