import mongoose from "mongoose";

// Custom function to get current local time
function getLocalTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // Get the timezone offset in minutes
  now.setMinutes(now.getMinutes() - offset); // Adjust to local timezone
  return now;
}

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    workoutName: {
      type: String,
      required: true,
      unique: true,
    },
    sets: {
      type: Number,
    },
    reps: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    caloriesBurned: {
      type: Number,
    },
    date: {
      type: Date,
      default: getLocalTime, // Use the custom function to get local time
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", WorkoutSchema);
