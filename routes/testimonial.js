import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  createTestimonial,
  getTestimonials,
  editTestimonial,
  deleteTestimonial,
  getTestimonial,
} from "../controllers/testimonial.js";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router
  .post("/create-testimonial", auth, upload.single("image"), createTestimonial)
  .put("/edit-testimonial/:id", auth, upload.single("image"), editTestimonial)
  .get("/:id", getTestimonial)
  .get("/", getTestimonials)
  .delete("/delete-testimonial/:id", auth, deleteTestimonial);

export default router;
