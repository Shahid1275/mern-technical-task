import express from "express";
import {
  adminLogin,
  getAllAppointments,
  getAllUsers,
} from "../controllers/adminController.js";
import { admin, protect } from "../middlewares/auth.js";

const adminRouter = express.Router();

// Public admin login
adminRouter.post("/login", adminLogin);

// Protected admin routes
adminRouter.get("/appointments", protect, admin, getAllAppointments);
adminRouter.get("/users", protect, admin, getAllUsers);

export default adminRouter;
