const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./src/db/db.js')
const insightsRoute = require("./src/routes/insights");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
app.use(cors({
    origin: "*",  
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"]
}));
app.use(express.json());
connectDB();

app.use("/api/insights", insightsRoute);

app.get("/hello", (req, res) => {
    res.json({ message: "Hello from API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// MONGO_URI="mongodb+srv://user:23456@maincluster.uunumib.mongodb.net/?appName=MainCluster"