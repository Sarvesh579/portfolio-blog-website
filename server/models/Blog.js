import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    blogId: { type: String, unique: true, index: true },
    title: { type: String, required: true },
    summary: { type: String },
    tags: { type: [String], default: [] },
    coverImage: { type: String },
    content: { type: String, required: true },
    contentSnippet: { type: String },
    importance: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    date: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
