import appointmentModel from "../models/appointmentModel.js";

const createAppointment = async (req, res) => {
  try {
    const { title, date, startTime, endTime } = req.body;

    // Basic validation
    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create date object at start of day to avoid timezone issues
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0); // Set to start of day

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res
        .status(400)
        .json({ error: "Cannot create appointment for past dates" });
    }

    const newAppointment = await appointmentModel.create({
      user: req.user._id,
      title,
      date: appointmentDate,
      startTime,
      endTime,
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      error: "Failed to create appointment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get All Appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({
        user: req.user._id,
      })
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

// Get Single Appointment
const getAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id);

    if (!appointment) return res.status(404).json({ error: "Not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointment" });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    const updated = await appointmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    const deleted = await appointmentModel.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
};

export {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
