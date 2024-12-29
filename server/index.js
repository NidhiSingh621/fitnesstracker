import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import router from "./routes/User.js";

dotenv.config();

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
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect("mongodb+srv://Nidhi:1234@cluster0.ttklc9i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true }) // Optional settings
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
    });
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
