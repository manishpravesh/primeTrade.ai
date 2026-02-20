const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerRules, loginRules } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);

module.exports = router;
