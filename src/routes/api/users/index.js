/**
 * The entry-point for /users endpoints
 */

const express = require("express");

const router = express.Router();

router.post(`/`, require("./post"));

router.get(`/:userId`, require("./getById"));

router.patch(`/:userId`, require("./patch"));

module.exports = router;
