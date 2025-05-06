require('dotenv').config();
const express = require('express');
const app = express();


const path = require('path');

// Serve Static Files
app.use(express.static(path.join(__dirname, '../client')));

// Default route - serve public_dashboard.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/public_dashboard.html'));
});

// Import Routers
const newsRouter = require("./routes/newsRoute");
const userRouter = require("./routes/userRoute");
const categoryRouter = require("./routes/categoryRoute");

// Middleware JSON Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Handle Preflight (OPTIONS)
app.options('*', (req, res) => {
    res.sendStatus(200);
});

// Mount Routers
app.use("/api/news", newsRouter);      // => e.g. /api/news/new, /api/news/get/:id
app.use("/api/user", userRouter);     // => e.g. /api/users/register
app.use("/api/categories", categoryRouter); // => e.g. /api/categories/all

// Start Server After Syncing DB Associations
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
