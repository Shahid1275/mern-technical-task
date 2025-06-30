import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Clean whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Store emails consistently
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Security: never return password in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Only allows these values
      default: "user", // Default role for new users
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.models.User || mongoose.model("User", userSchema);
