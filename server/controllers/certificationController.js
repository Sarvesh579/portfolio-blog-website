import Certification from "../models/Certification.js";


export const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ importance: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCertification = async (req, res) => {
  try {
    const cert = new Certification({
      title: req.body.title,
      issuer: req.body.issuer,
      date: req.body.date,
      importance: req.body.importance ?? 0,
      credentialId: req.body.credentialId,
      credentialUrl: req.body.credentialUrl,
      image: req.body.image,
      fileType: req.body.fileType
    });

    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const updated = await Certification.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        issuer: req.body.issuer,
        date: req.body.date,
        credentialId: req.body.credentialId,
        credentialUrl: req.body.credentialUrl,
        importance: req.body.importance ?? 0,
        image: req.body.image,
        fileType: req.body.fileType
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    const deleted = await Certification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json({ message: "Certification deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
