const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());


/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "CRAFTDEFINE Backend is running!",
        database: mongoose.connection.readyState === 1
            ? "MongoDB Connected"
            : "MongoDB Not Connected"
    });

});


/* =========================
   MONGODB CONNECTION
========================= */

async function startServer() {

    try {

        if (!MONGO_URI) {

            console.error("❌ MONGO_URI is missing from .env");

            process.exit(1);
        }


        await mongoose.connect(MONGO_URI);

        console.log("--------------------------------");
        console.log("CRAFTDEFINE BACKEND");
        console.log("--------------------------------");
        console.log("✅ MongoDB connected successfully");
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`🌐 http://localhost:${PORT}`);
        console.log("--------------------------------");


        app.listen(PORT, () => {

            console.log("🚀 CRAFTDEFINE API is ready!");

        });

    } catch (error) {

        console.error("--------------------------------");
        console.error("❌ MongoDB connection failed");
        console.error("--------------------------------");
        console.error(error.message);
        console.error("--------------------------------");

    }

}


startServer();