const express = require("express");
const mongoose = require("mongoose");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const dashboardRouter = require("./routes/dashboard");
const loggedIn = require("./models/helper");
const session = require("express-session")
const MongoStore = require('connect-mongo');
const app = express();
const PORT = process.env.PORT || 3000;
const uri = "mongodb+srv://shlok:j0WCgfu59b8iBK8F@main.lh5dwv4.mongodb.net/data?retryWrites=true&w=majority&appName=main";
mongoose.connect(uri);

app.use(session({
    secret: 'rishitsucks', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: uri,  
        collectionName: 'sessions',
        ttl: 30 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}));

app.use((req, res, next) => {
    const isLoggedIn = loggedIn(req, res, next);
    const publicPaths = ["/", "/login", "/signup", "/logout"];

    if (!isLoggedIn && publicPaths.includes(req.url)) {
        return next();
    }

    if (isLoggedIn && (req.url == "/login" || req.url == "/signup")) {
        return res.redirect("/dashboard");
    }

    if (isLoggedIn || publicPaths.includes(req.url)) {
        return next();
    }
    return res.redirect("/");
})

app.use(express.urlencoded({ extended: true }));
app.use("/dashboard", dashboardRouter)
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.get('/', (req, res) => {
    const isLoggedIn = loggedIn(req);
    if (isLoggedIn) {
        return res.redirect("/dashboard");  
    }
    res.sendFile("index.html", {root: "./views/"});
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Logout error:", err);
            return res.status(500).send("Error logging out.");
        }
        res.redirect("/");
    });
})

app.listen(PORT, () => {
    console.log("Server is on.");
})