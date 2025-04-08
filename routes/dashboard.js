const express = require("express");
const dashboardRouter = express();
const User = require("../models/user");

dashboardRouter.get("/", (req, res, next) => {
    res.sendFile("dashboard.html", {root: "./views"});
})

module.exports = dashboardRouter;