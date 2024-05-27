import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  createCategory,
  getCategories,
  editCategory,
  deleteCategory,
  getCategory,
} from "../controllers/category.js";

const router = express.Router();


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router
  .post(
    "/create-category",
    auth,
    upload.single("categoryImage"),
    createCategory
  )
  .put("/edit-category/:id", auth, upload.single("categoryImage"), editCategory)
  .get("/:id", getCategory)
  .get("/", getCategories)
  .delete("/delete-category/:id", auth, deleteCategory);

export default router;
