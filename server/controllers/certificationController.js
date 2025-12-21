import Certification from "../models/Certification.js";

// GET all certifications
export const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create certification
export const createCertification = async (req, res) => {
  try {
    const cert = new Certification(req.body);
    await cert.save();
    res.json(cert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
