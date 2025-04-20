const express = require("express");
const dashboardRouter = express();
const UserModel = require("../models/user");
const spawn = require("child_process").spawn;
dashboardRouter.use(express.json());

dashboardRouter.get("/", async(req, res, next) => {
    const user = await UserModel.findById(req.session.userId);
    res.render("dashboard.ejs", {chatLog: user.chats});
})

dashboardRouter.post("/", async(req, res, next) => {
    const {text} = req.body;
    const user = await UserModel.findById(req.session.userId);

    user.chats.push("User: " + text);
    await user.save();

    const chatBot = spawn("./venv/bin/python3", ["ai/chatbot.py", text, user.chats, user.language]);

    chatBot.stdout.on("data", async (data) => {
        const response = data.toString();
        res.status(201).send(JSON.stringify({response: response}));
        user.chats.push("You: " + response);
        await user.save();
    })
})

module.exports = dashboardRouter;