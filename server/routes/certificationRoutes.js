import express from "express";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification
} from "../controllers/certificationController.js";

const router = express.Router();

router.get("/", getCertifications);
router.post("/", createCertification);
router.put("/:id", updateCertification);
router.delete("/:id", deleteCertification);

export default router;
