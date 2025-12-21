import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  myId: { type: String, unique: true }, // your custom ID
  title: { type: String, required: true },
  summary: { type: String },
  tags: { type: [String], default: [] },
  coverImage: { type: String }, // URL or base64
  content: { type: String, required: true },
  contentSnippet: { type: String }
}, { timestamps: true });

export default mongoose.model("Blog", BlogSchema);
