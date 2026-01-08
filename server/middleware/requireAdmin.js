import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ 
      error: "Unauthorized"
    });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}
