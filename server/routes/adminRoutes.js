import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Blog from "../models/Blog.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";

import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

/* -------------------------------------------------------
   ADMIN LOGIN  (POST /api/admin/login)
------------------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Trying");

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true only in HTTPS
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------------------------
   ADMIN LOGOUT  (POST /api/admin/logout)
------------------------------------------------------- */
router.post("/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({ success: true });
});

/* -------------------------------------------------------
   ADMIN DASHBOARD STATS (GET /api/admin/stats)
------------------------------------------------------- */
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const blogs = await Blog.countDocuments();
    const projects = await Project.countDocuments();
    const certificates = await Certification.countDocuments();

    res.json({ blogs, projects, certificates });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Error fetching stats" });
  }
});

export default router;