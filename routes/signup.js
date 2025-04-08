const express = require("express");
const signupRouter = express.Router();
const User = require("../models/user");

signupRouter.get("/", (req, res, next) => {
    res.sendFile("signup.ejs")
})


signupRouter.post("/", async (req, res, next) => {
    const {email, password} = req.body;

    try {
    if (await User.findOne({email})) {
        return res.status(409).send("Email already taken.");
    }
    const newUser = new User({email, password});
    await newUser.save();

    req.session.userId = newUser._id;
    res.status(201).send("User created!");
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = signupRouter;