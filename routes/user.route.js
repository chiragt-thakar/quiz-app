const express = require("express");
const { getHome } = require("../controllers/index");
const { loginUser } = require("../controllers/user.controller");

const router = express.Router();

router.post('/login',loginUser);

module.exports = router;
