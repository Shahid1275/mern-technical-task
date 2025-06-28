import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import router from "./routes/appointmentRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoutes.js";

connectDB();
//initialize the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", router);

app.get("/", (req, res) => {
  res.send("API is working Good ");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
