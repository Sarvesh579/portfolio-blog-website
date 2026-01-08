import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          setAllowed(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllowed(res.ok);
      } catch {
        setAllowed(false);
      }
    }

    checkAuth();
  }, []);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/admin/login" />;

  return children;
}
