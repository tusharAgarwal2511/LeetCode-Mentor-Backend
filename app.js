const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./src/db/db.js')
const insightsRoute = require("./src/routes/insights");
const cors = require("cors");

const app = express();
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

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// MONGO_URI="mongodb+srv://user:23456@maincluster.uunumib.mongodb.net/?appName=MainCluster"