import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded);

    // Set req.user based on token role
    if (decoded.role === "admin") {
      req.user = {
        _id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      };
    } else {
      const user = await userModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      req.user = user;
    }

    console.log("req.user after setting:", req.user);
    next();
  } catch (error) {
    console.error("Verification Error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};
