import express from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import {
  addTeamMember,
  getTeamMembers,
  editTeamMember,
  deleteTeamMember,
  getTeamMember,
} from "../controllers/team.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .post("/add-member", auth, upload.single("image"), addTeamMember)
  .put("/edit-member/:id", auth, upload.single("image"), editTeamMember)
  .delete("/delete-member/:id", auth, deleteTeamMember)
  .get("/:id", getTeamMember)
  .get("/", getTeamMembers);

export default router;
