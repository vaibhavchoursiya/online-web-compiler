const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authChecker = require("../middleware/auth_middleware");

// Router Level Middle Ware
router.use("/changepassword", authChecker);
router.use("/currentuser", authChecker);
router.use("/programs", authChecker);
router.use("/program", authChecker);

//public
router.post("/register", UserController.userRegister);
router.post("/login", UserController.userLogin);

//private (auth)
router.post("/changepassword", UserController.changePassword);
router.post("/currentuser", UserController.currentUser);
router.post("/programs", UserController.userPrograms);
router.post("/program", UserController.userProgram);

module.exports = router;
