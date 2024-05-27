import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: true,
  },
  categoryImage: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model("Category", categorySchema);
