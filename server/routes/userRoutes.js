import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

// POST register
userRouter.post("/register", registerUser);

// POST login
userRouter.post("/login", loginUser);

//logout api
userRouter.post("/logout", logoutUser);

export default userRouter;
