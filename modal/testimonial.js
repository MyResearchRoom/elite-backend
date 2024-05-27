import mongoose from "mongoose";

const testimonialSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  designation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

export default mongoose.model("Testimonial", testimonialSchema);
