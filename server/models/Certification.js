import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String },
  date: { type: String },
  image: { type: String }, // certificate image
  description: { type: String }
}, { timestamps: true });

export default mongoose.model("Certification", CertificationSchema);
