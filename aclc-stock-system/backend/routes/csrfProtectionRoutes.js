// csrfRoutes.js
const express = require("express");
const router = express.Router();

const { getCsrfToken } = require("../middleware/csrfProtection");

router.get("/csrf-token", getCsrfToken);

module.exports = router;
