import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String },
  date: { type: String },
  image: { type: String }, // certificate image
  fileType: { type: String, enum: ["pdf", "image"] },
  credentialId: { type: String },
  credentialUrl: { type: String },
  importance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Certification", CertificationSchema);
