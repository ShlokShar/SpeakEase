const express = require("express");
const dashboardRouter = express();
const User = require("../models/user");

dashboardRouter.use(express.json());

dashboardRouter.get("/", (req, res, next) => {
    res.render("dashboard.ejs");
})
dashboardRouter.post("/", (req, res, next) => {
    const {text} = req.body;
    res.status(201).send("Message received! :P");
})

module.exports = dashboardRouter;