const express = require("express");
const signupRouter = express.Router();
const User = require("../models/user");

signupRouter.get("/", (req, res, next) => {
    res.render("signup.ejs")
})


signupRouter.post("/", async (req, res, next) => {
    let {email, password, language} = req.body;
    const match = language.match(/\(([^)]+)\)/);
    language = match ? match[1] : language;
    const chatLog = ["You: Hi there! My name is SpeakBot and I'm here to help you in your journey to learn English. Let's learn and practice conversing together."]

    try {
        if (await User.findOne({email})) {
            return res.status(409).send("Email already taken.");
        }
        console.log(chatLog);
        const newUser = new User({email, password, language, chats: chatLog});
        await newUser.save();

        req.session.userId = newUser._id;
        res.status(201).redirect("/dashboard");
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = signupRouter;