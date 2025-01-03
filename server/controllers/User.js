import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import mongoose from "mongoose";
dotenv.config();

const generateToken = (userId) => {
 
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "9999 years" });
};

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
   
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = generateToken(user._id);
    console.log(user);
    return res.status(200).json({ token, user });
  } catch (error) {
    
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extracting user ID from token payload

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createError(400, "Invalid user ID"));
    }

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const currentDate = new Date();
    const startToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);  // Normalize to start of day (midnight)
    const endToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);  // Start of the next day

    // Start of the week (7 days ago) - adjusted to include full range of last 7 days
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 6);  // Go 7 days back
    oneWeekAgo.setHours(0, 0, 0, 0);  // Set the time to midnight of that day

    // Using Promise.all to run all queries concurrently
    const [totalCaloriesBurnt, totalWorkouts, categoryCalories, weeklyWorkouts] = await Promise.all([
      // Total calories burned today
      Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
        { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
      ]),

      // Total workouts today
      Workout.countDocuments({ user: userId, date: { $gte: startToday, $lt: endToday } }),

      // Calories burned per category today
      Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
        { $group: { _id: "$category", totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
      ]),

      // Weekly calories burned (last 7 days)
      Workout.aggregate([
        { 
          $match: { 
            user: user._id, 
            date: { $gte: oneWeekAgo } // Match any workout from the last 7 days
          }
        },
        { 
          $project: {
            dateString: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Format the date as YYYY-MM-DD
            caloriesBurned: 1, // Include calories burned in the projection
          }
        },
        { 
          $group: {
            _id: "$dateString", // Group by formatted date (YYYY-MM-DD)
            totalCaloriesBurnt: { $sum: "$caloriesBurned" }, // Sum the calories burned for that day
          }
        },
        { 
          $sort: { _id: 1 } // Sort by date in descending order (most recent first)
        }
      ])
      
      ,
    ]);

    // Debugging the query results by logging
    console.log("Total Calories Burnt:", totalCaloriesBurnt);
    console.log("Total Workouts:", totalWorkouts);
    console.log("Category Calories:", categoryCalories);
    console.log("Weekly Workouts:", weeklyWorkouts);

    // Average calories burned per workout today
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Prepare data for Pie chart (Calories by category)
    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    // Weekly calories burned (formatting it for the pie chart)
    const weeklyCaloriesBurned = weeklyWorkouts.map((data, index) => ({
      day: `Day ${index + 1}`, // Assign day numbers starting from "Day 1"
      calories: data.totalCaloriesBurnt, // Total calories burned for that day
    }));
    
    // Log the reshaped weekly calories burned
    console.log("Weekly Calories Burned (Formatted):");
    weeklyCaloriesBurned.forEach((entry) => {
      console.log(`${entry.day}: ${entry.calories} calories`);
    });
    
    // Sort the data in reverse chronological order (most recent first)
    weeklyCaloriesBurned.sort((a, b) => new Date(b.day) - new Date(a.day)); // Sort by day number
    

    // Check if data is being populated correctly
    if (pieChartData.length === 0 || weeklyCaloriesBurned.length === 0) {
      console.warn("Warning: Pie chart or weekly data is empty!");
    }

    // Log weekly calories burned in reverse chronological order
    console.log("Weekly Calories Burned (Most Recent First):");
    weeklyCaloriesBurned.forEach((entry) => {
      console.log(` ${entry.day}: ${entry.calories} calories`);
    });

    return res.status(200).json({
      totalCaloriesBurnt: totalCaloriesBurnt.length > 0 ? totalCaloriesBurnt[0].totalCaloriesBurnt : 0,
      totalWorkouts,
      avgCaloriesBurntPerWorkout,
      pieChartData,
      weeklyCaloriesBurned, // This is now ready for the pie chart
    });
  } catch (err) {
    console.error("Error in dashboard query:", err); // Log errors in the catch block
    next(err);
  }
};







export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();
   

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Normalize the date to start at the beginning of the day (midnight)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);  // Normalize to start of day (midnight)
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);  // Start of the next day

    // Find all workouts for the user within the date range (from startOfDay to endOfDay)
    const todaysWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    // Calculate total calories burnt for the day
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    

    // Send the response with today's workouts and total calories burnt
    return res.status(200).json({
      todaysWorkouts,
      totalCaloriesBurnt,
    });
  } catch (err) {
    console.error("Error fetching workouts by date:", err);
    next(err);
  }
};



export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (userId) {
      const { workoutString } = req.body;
      if (!workoutString) {
        return next(createError(400, "Workout string is missing"));
      }

      // Split workoutString into lines
      const eachworkout = workoutString.split(";").map((line) => line.trim());
      const categories = eachworkout.filter((line) => line.startsWith("#"));
      if (categories.length === 0) {
        return next(createError(400, "No categories found in workout string"));
      }

      const parsedWorkouts = [];
      let currentCategory = "";
      let count = 0;

      for (const line of eachworkout) {
        count++;
        if (line.startsWith("#")) {
          const parts = line?.split("\n").map((part) => part.trim());
          
          if (parts.length < 5) {
            return next(createError(400, `Workout string is missing for ${count}th workout`));
          }

          currentCategory = parts[0].substring(1).trim();
          const workoutDetails = parseWorkoutLine(parts);
          if (workoutDetails == null) {
            return next(createError(400, "Please enter in proper format"));
          }

          // Check if any workout with the same category exists for the user
          const existingWorkouts = await Workout.find({
            user: userId,
            category: currentCategory,
          }).exec();

          const existingWorkout = existingWorkouts.find(workout =>
            workout.workoutName.toLowerCase() === workoutDetails.workoutName.toLowerCase()
          );

          if (existingWorkout) {
            return next(createError(409, `A workout under the category ${currentCategory} with name ${workoutDetails.workoutName} already exists.`));
          }

          workoutDetails.category = currentCategory;
          parsedWorkouts.push(workoutDetails);
        } else {
          return next(createError(400, `Workout string is missing for ${count}th workout`));
        }
      }

      // Calculate calories burnt for each workout and save
      await Promise.all(parsedWorkouts.map(async (workout) => {
        workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
        try {
          // Try inserting the workout, handle duplicate key error
          await Workout.create({ ...workout, user: userId });
        } catch (error) {
          if (error.code === 11000) {
            return next(createError(409, `A workout with the name ${workout.workoutName} already exists`));
          } else {
            throw error;  // Rethrow if the error is not a duplicate key error
          }
        }
      }));

      return res.status(201).json({
        message: "Workouts added successfully",
        workouts: parsedWorkouts,
      });
    }
  } catch (err) {
    next(err);
  }
};


// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  const details = {};
  
  if (parts.length >= 5) {
    details.workoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};