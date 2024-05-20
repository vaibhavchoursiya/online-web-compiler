const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authChecker = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      console.log(token);

      const { userID } = jwt.verify(token, process.env.JWT_SCECRT_KEY);
      const loggedUser = await UserModel.findById(userID).select("-password");
      req.user = loggedUser;
      console.log(`Logged User : ${loggedUser}`);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized token or not token" });
  }
};

module.exports = authChecker;
