import express from "express";
import { getCertifications, createCertification } from "../controllers/certificationController.js";

const router = express.Router();

router.get("/", getCertifications);
router.post("/", createCertification);

export default router;
