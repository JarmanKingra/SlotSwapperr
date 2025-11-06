import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();
import authRoutes from "./src/Routes/auth.js";
import eventRoutes from "./src/Routes/events.js"
import swapRoutes from "./src/Routes/swap.js"

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001; 

const app = express(); 
app.use(cors());
app.use(express.json()) 
app.use(express.urlencoded({limit: "40kb", extended: true}));
app.use(authRoutes)
app.use(eventRoutes)
app.use(swapRoutes)


app.get("/", (req, res) => {
    return res.json({"hello" : "World"})
})


const start = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
}

start();


