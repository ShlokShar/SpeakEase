const express = require("express");
const loginRouter = express.Router();
const User = require("../models/user");

loginRouter.get("/", (req, res, next) => {
    res.sendFile("login.html", {root: "./views"})
})

loginRouter.post("/", async (req, res, next) => {
    const {email, password} = req.body;
    const allegedUser = await User.findOne({email});
    try {
    if (allegedUser && allegedUser.password == password) {
        return res.status(201).send("Logged in!");
    }

    req.session.userId = allegedUser._id;
    res.status(500).send("Incorrect Username or Password");
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = loginRouter;