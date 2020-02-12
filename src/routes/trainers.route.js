const express = require("express");
const Trainer = require("../models/trainer.model.js");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protectRoute } = require("../middleware/auth");

//creating a new Trainer
router.post("/", async (req, res, next) => {
  try {
    const trainer = new Trainer(req.body);
    await Trainer.init();
    const newTrainer = await trainer.save();
    res.status(201).send(newTrainer);
  } catch (err) {
    err.message = "Trainer Validation Error";
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).send(trainers);
  } catch (err) {
    next(err);
  }
});

//create JWT
const createJWT = username => {
  const payload = { name: username };
  console.log("secret key is" + process.env.JWT_SECRET_KEY);
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const trainer = await Trainer.findOne({ username });
    const result = await bcrypt.compare(password, trainer.password);

    if (!result) {
      throw new Error("Login Failed");
    }

    const token = createJWT(trainer.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true
    });

    // why can't we have secure: true?

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login Failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.get("/:username", protectRoute, async (req, res, next) => {
  const INCORRECT_ERR = "Incorrect user"
  try {
    const username = req.params.username;
    if (req.user.name !== username) {
      throw new Error(INCORRECT_ERR);
    }
    //const regex = new RegExp(username, "gi");
    const trainers = await Trainer.find({ username });
    res.send(trainers);
  } catch (err) {
    err.message = INCORRECT_ERR;
    err.statusCode = 403;
    next(err);
  }
});
module.exports = router;
