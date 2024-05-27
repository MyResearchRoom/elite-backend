import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import projectRouter from "./routes/project.js";
import testimonialRouter from "./routes/testimonial.js";
import teamRouter from "./routes/team.js";
import contactRouter from "./routes/contact.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/project", projectRouter);
app.use("/testimonial", testimonialRouter);
app.use("/team", teamRouter);
app.use("/contact", contactRouter);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
