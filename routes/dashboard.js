const express = require("express");
const dashboardRouter = express();
const User = require("../models/user");
const spawn = require("child_process").spawn;
dashboardRouter.use(express.json());

dashboardRouter.get("/", (req, res, next) => {
    res.render("dashboard.ejs");
})

dashboardRouter.post("/", (req, res, next) => {
    const {text} = req.body;
    console.log(text);
    res.status(201).send(JSON.stringify({response: "Message received! :P"}));
})

module.exports = dashboardRouter;