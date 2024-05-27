import express from "express";
import {
  loginUser,
  userRegister,
  getUser,
  changePassword,
  logout,
} from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router
  .get("/me", auth, getUser)
  .post("/register", userRegister)
  .post("/login", loginUser)
  .put("/change-password", auth, changePassword)
  .post("/logout", auth, logout);

export default router;
