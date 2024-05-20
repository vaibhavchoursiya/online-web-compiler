const express = require("express");
const router = express.Router();
const path = require("path");
const { getExt } = require(path.join(__dirname, "..", "helper", "helper.js"));

// router.get("/c", (req, res) => {});
// router.get("/cpp", (req, res) => {});
// router.get("/java", (req, res) => {});
// router.get("/python", (req, res) => {});
// router.get("/ruby", (req, res) => {});
router.get("/", (req, res) => {
  res.redirect("/python");
});

router.get("/:language", (req, res) => {
  const languageName = req.params.language;
  const ext = getExt(languageName);

  const data = {
    languageName: languageName,
    ext: ext,
  };

  res.render("oc.ejs", data);
});

router.get("/hcj/playground", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "playground.html"));
});

router.get("/user/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
});

router.get("/user/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.get("/user/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "useradmin.html"));
});

router.get("/user/:id", (req, res) => {
  const programID = req.params.id;
  res.sendFile(path.join(__dirname, "..", "views", "showprogram.html"));
});

module.exports = router;
