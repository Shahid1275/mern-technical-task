import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// POST register
userRouter.post("/register", registerUser);

// POST login
userRouter.post("/login", loginUser);

export default userRouter;
