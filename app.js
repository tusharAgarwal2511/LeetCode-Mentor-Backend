require("dotenv").config(); // ✅ MUST be first

const express = require("express");
const connectDB = require("./src/db/db.js");
const insightsRoute = require("./src/routes/insights");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/insights", insightsRoute);

app.get("/hello", (req, res) => {
    res.json({ message: "Hello from API" });
});

const PORT = process.env.PORT || 3000; // ✅ correct
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
