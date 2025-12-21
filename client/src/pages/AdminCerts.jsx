import { Link } from "react-router-dom";

export default function AdminBlogs() {
  return (
    <div className="admin-page">
      <Link to="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
      <h1>Manage Certificates</h1>
    </div>
  );
}
