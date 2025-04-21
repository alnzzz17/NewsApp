require('dotenv').config();
const express = require('express');
const app = express();

// === Import Routers ===
const newsRouter = require("./routes/newsRoute");
const userRouter = require("./routes/userRoute");
const categoryRouter = require("./routes/categoryRoute");

// === Middleware JSON Parser ===
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// === CORS Configuration ===
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// === Handle Preflight (OPTIONS) ===
app.options('*', (req, res) => {
    res.sendStatus(200);
});

// Mount Routers
app.use("/api/news", newsRouter);      // => e.g. /api/news/new, /api/news/get/:id
app.use("/api/user", userRouter);     // => e.g. /api/users/register
app.use("/api/categories", categoryRouter); // => e.g. /api/categories/all

// === Default Root Route ===
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

// === Start Server After Syncing DB Associations ===
const association = require('./utils/dbAssoc');
const PORT = process.env.PORT || 5000;

association()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB Association Error:", err.message);
    });
