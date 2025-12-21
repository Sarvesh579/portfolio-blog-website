import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault(); // prevents default form reload
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid login");
        return;
      }

      // store auth token
      localStorage.setItem("adminToken", data.token);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  }

  return (
    <div className="admin-login">
      <h1>Admin Login</h1>

      {/* ENTER KEY ONLY WORKS IF FORM WRAPS INPUTS + BUTTON */}
      <form onSubmit={handleLogin}>

        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
