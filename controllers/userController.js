const UserModel = require("../models/userModel");
const UserProgramModel = require("../models/userProgram");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const responseToExistedUserEmailName = (res, userE, userU) => {
  if (userE && !userU) {
    res.json({
      status: "Failed",
      exist: "email",
      message: "Email Already Exist.",
    });
  } else if (userU && !userE) {
    res.json({
      status: "Failed",
      exist: "username",
      message: "Username Already Exist.",
    });
  } else if (userE && userU) {
    res.json({
      status: "Failed",
      exist: "both",
      message: "UserName or Email Already Exist.",
    });
  }
};

const createToken = (id) => {
  const token = jwt.sign(
    {
      userID: id,
    },
    process.env.JWT_SCECRT_KEY,
    { expiresIn: "5d" }
  );
  return token;
};
class UserController {
  static userRegister = async (req, res) => {
    const { name, email, password, confirm_password, username } = req.body;
    console.log(req.body);
    /* All Field are Required */
    if (name && email && password && confirm_password && username) {
      const userE = await UserModel.findOne({ email: email });
      const userU = await UserModel.findOne({ username: username });

      if (userE || userU) {
        responseToExistedUserEmailName(res, userE, userU);
      } else {
        /* User Dont Exist */
        if (password === confirm_password) {
          try {
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              username: username,
            });
            await newUser.save();
            // Jwt Token
            const savedUser = await UserModel.findOne({ email: email });
            const token = createToken(savedUser._id);
            res.status(201).json({
              status: "Success",
              message: " New User is Register",
              token: token,
            });

            // res.redirect("/user/login");
          } catch (error) {
            console.log(error);
            res.send({
              status: "Failed",
              message: "Not Able to Register User",
            });
          }
        } else {
          /* Password dont Match */
          res.send({
            status: "Failed",
            message: "Password and Confirm Password do not Match",
          });
        }
      }
    } else {
      res.json({ status: "Failed", message: "All Field Are Required." });
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user !== null) {
          const match = await bcrypt.compare(password, user.password);
          if (email === user.email && match) {
            //JWT token
            const token = createToken(user._id);
            res.json({
              status: "Success",
              message: "Login SuccessFul",
              token: token,
            });
          } else {
            res.json({
              status: "Failed",
              message: "Email or Password does not Valid.",
            });
          }
        } else {
          res.json({ status: "Failed", message: "Your Are not Registered." });
        }
      } else {
        res.json({ status: "Failed", message: "All Field Are Required." });
      }
    } catch (e) {
      console.log(e);
      res.json({ status: "Failed", message: "Unable to Login" });
    }
  };

  static changePassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
      if (password === confirm_password) {
        const hashPassword = await bcrypt.hash(password, 10);
        const loggedUser = await UserModel.findById(req.user._id);
        loggedUser.password = hashPassword;
        await loggedUser.save();
        res.send({
          status: "Success",
          message: "Password change successfull.",
        });
      } else {
        res.send({
          status: "Failed",
          message: "Password and Confirm Password do not Match",
        });
      }
    } else {
      res.send({ status: "Failed", message: "All Field Are Required." });
    }
  };

  static currentUser = async (req, res) => {
    const user = req.user;
    res.json({ status: "success", user: user });
  };

  static userPrograms = async (req, res) => {
    const username = req.user.username;
    const data = await UserProgramModel.find({ username: username });
    console.log(data);
    res.json({ data: data });
  };

  static userProgram = async (req, res) => {
    const { programID } = req.body;
    const user = await UserProgramModel.findOne({ _id: programID });
    if (user) {
      res.json(user);
    }
  };
}

module.exports = UserController;
