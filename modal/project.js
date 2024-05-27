import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  heading2: {
    type: String,
  },
  paragraphs: {
    type: [String],
  },
  images: {
    type: [{ data: Buffer, contentType: String }],
  },
});

export default mongoose.model("Project", projectSchema);
