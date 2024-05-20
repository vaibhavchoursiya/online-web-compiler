const express = require("express");
const router = express.Router();
const {
  getCode,
  saveCode,
  sendProgramStructure,
} = require("../../controllers/apiControllers");
const authChecker = require("../../middleware/auth_middleware");

//Router Level MiddleWare
router.post("/save", authChecker);

router.post("/run", getCode);

router.post("/save", saveCode);

router.post("/program_structure", sendProgramStructure);

module.exports = router;
