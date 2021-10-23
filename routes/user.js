const express = require("express");
const router = express.Router();
const User = require("../src/models/User");
const authorization = require("../src/middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", async (req, res) => {
  var token = req.cookies.authorization;
  const finduser = await User.find({ active: true }, null, {
    sort: { name: 1 },
  });
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) console.log(err);
      else req.user = user;
      // console.log(user);
      res.render("signup", { user: user, found: finduser });
    });
  } else res.render("signup", { user: req.user, found: finduser });
});

router.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      console.log("Email already registered");
      res.redirect("/user/signup");
      return;
    }
    if (password == cpassword) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        active: true,
      });

      const newuser = await newUser.save();
      if (!newUser) {
        console.log("Unable to signup");
        res.redirect("/user/signup");
        return;
      }
      console.log("user registered");
      res.redirect("/user/login");
    } else {
      console.log("password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("User with email doesnt exist");
    return;
  }
  const checkPassword = await bcrypt.compare(req.body.password, user.password);
  if (!checkPassword) {
    console.log("password doesnt match");
    res.redirect("/user/login");
    return;
  }
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  res.cookie("authorization", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
  });
  console.log("user logged in");
  res.redirect("/");
});

//get route for logging out user
router.get("/logout", function (req, res) {
  res.clearCookie("authorization");
  console.log("You are successfully logged out");
  res.redirect("/");
});

//Export
module.exports = router;
