import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
  name: {
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
  linkedInUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Team", teamSchema);
