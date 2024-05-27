import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  createProject,
  deleteProject,
  editProject,
  getProject,
  getProjects,
} from "../controllers/project.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .post(
    "/create-project",
    auth,
    upload.fields([{ name: "image" }, { name: "images[]" }]),
    createProject
  )
  .put(
    "/edit-project/:id",
    auth,
    upload.fields([{ name: "image" }, { name: "images[]" }]),
    editProject
  )
  .delete("/delete-project/:id", auth, deleteProject)
  .get("/:id", getProject)
  .post("/", getProjects);

export default router;
