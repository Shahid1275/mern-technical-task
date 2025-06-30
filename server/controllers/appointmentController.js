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
    appointmentDate.setHours(0, 0, 0, 0);

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res
        .status(400)
        .json({ error: "Cannot create appointment for past dates" });
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: "Invalid time format. Use HH:MM" });
    }

    // Validate endTime > startTime
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    if (endMinutes <= startMinutes) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
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
    if (error.name === "ValidationError") {
      // Handle mongoose validation errors
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors.join(", ") });
    }
    res.status(500).json({
      error: "Failed to create appointment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ user: req.user._id })
      .sort({ date: 1, startTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointment" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { title, date, startTime, endTime, status } = req.body;

    // Basic validation
    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: "Invalid time format. Use HH:MM" });
    }

    // Validate endTime > startTime
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    if (endMinutes <= startMinutes) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }

    // Create date object at start of day to avoid timezone issues
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res
        .status(400)
        .json({ error: "Cannot update appointment to past dates" });
    }

    // Validate status if provided
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be pending, confirmed, or cancelled",
      });
    }

    const updated = await appointmentModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date: appointmentDate,
        startTime,
        endTime,
        status: status || "pending",
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const deleted = await appointmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

export {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
