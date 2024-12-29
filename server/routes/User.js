import express from "express";
import { UserRegister } from "../controllers/User.js";
import bcrypt from "bcrypt";
import { UserLogin } from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { getUserDashboard } from "../controllers/User.js";
const router = express.Router(); // Use `router` consistently throughout

router.post("/signup", UserRegister);// Fix syntax error in the route definition
router.post("/signin", UserLogin); // Fix syntax error in the route definition

router.get("/dashboard", verifyToken,getUserDashboard);

export default router;
