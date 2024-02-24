const express = require("express");
const router = express.Router();
const UserDriver = require("../drivers/User");
const check = require("../middlewares/auth");

//RUTAS
router.post("/hello", check.auth, UserDriver.user);
router.post("/register", UserDriver.register);
router.get("/login", UserDriver.login);
router.get("/user/:id", check.auth, UserDriver.getUser);
router.put("/user/:id", check.auth, UserDriver.updateUser);

//Exportar router
module.exports = router;
