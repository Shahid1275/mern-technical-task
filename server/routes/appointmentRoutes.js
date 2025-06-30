import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Create appointment
router.post("/create", createAppointment);

// Get appointments
router.get("/", getAppointments);

// Get single appointment
router.get("/:id", getAppointment);

// Update appointment
router.put("/:id", updateAppointment);

// Delete appointment
router.delete("/:id", deleteAppointment);

export default router;
