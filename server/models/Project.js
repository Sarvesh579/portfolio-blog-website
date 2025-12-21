import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tech: { type: [String], default: [] },
  description: { type: String },
  images: { type: [String], default: [] }, // URLs
  github: { type: String },
  live: { type: String }
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
