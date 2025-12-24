import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          "http://localhost:4000/api/admin/stats",
          {
            credentials: "include",
          }
        );

        setAllowed(res.ok);
      } catch {
        setAllowed(false);
      }
    }

    checkAuth();
  }, []);

  if (allowed === null) return null; // or loader
  if (!allowed) return <Navigate to="/admin/login" />;

  return children;
}
