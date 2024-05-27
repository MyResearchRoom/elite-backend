import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createContact,
  getContacts,
  deleteContact,
} from "../controllers/contact.js";

const router = express.Router();

router
  .post("/create-contact", createContact)
  .get("/", auth, getContacts)
  .delete("/delete-contact/:id", auth, deleteContact);

export default router;
