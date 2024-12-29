import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import router from "./routes/User.js";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // Fixed the typo "extented" → "extended"



// Routes
app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "Hi!",
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err.message,
    });
  }
});

app.use("/api/user",UserRoutes);

app.use((err,req,res,next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success:false,
    status,
    message,
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB..."); // Log instead of alert
    mongoose.set("strictQuery", true);

    await mongoose.connect(
      "mongodb+srv://himanshuu932:88087408601@cluster0.lu2g8bw.mongodb.net/test1?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    console.log("Connected to MongoDB"); // Successful connection
  } catch (err) {
    console.error("MongoDB connection error:", err.message); // Catch and log errors
  }
};

// Server Start Function
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 8080;
    connectDB(); // Corrected the function call
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Error starting the server:", err.message);
  }
};

// Start the Server
startServer();
