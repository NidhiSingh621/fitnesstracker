import express from "express";
import { UserRegister, addWorkout, UserLogin, getWorkoutsByDate, getUserDashboard } from "../controllers/User.js"; // Import getWorkoutsByDate
import bcrypt from "bcrypt";
import { verifyToken } from "../middleware/verifyToken.js"; // Assuming verifyToken middleware is set up correctly

const router = express.Router(); // Use `router` consistently throughout

// User Registration and Login routes
router.post("/signup", UserRegister);  // Handles user registration
router.post("/signin", UserLogin);    // Handles user login

// Protected routes requiring token verification
router.get("/dashboard", verifyToken, getUserDashboard);  // Get user dashboard (protected)
router.post("/workout", verifyToken, addWorkout);  // Add a workout (protected)
router.get('/workout', verifyToken, getWorkoutsByDate);  // Get workouts by date (protected)

export default router;
