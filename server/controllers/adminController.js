import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs"; // Add this for password hashing
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Check if admin exists, create if not
      let adminUser = await userModel.findOne({ email });
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash(
          process.env.ADMIN_PASSWORD,
          10
        );
        adminUser = await userModel.create({
          name: "Admin User",
          email,
          password: hashedPassword,
          role: "admin",
        });
      }

      // Create token with user's _id
      const token = jwt.sign(
        {
          id: adminUser._id.toString(), // Use real _id from database
          email: adminUser.email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: adminUser._id.toString(),
          email: adminUser.email,
          role: "admin",
        },
        message: "Admin login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// Other exports (getAllAppointments, getAllUsers) remain unchanged
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find()
      .populate("user", "name email")
      .sort({ date: -1 });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: { $ne: "admin" } }) // Exclude users with role "admin"
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
