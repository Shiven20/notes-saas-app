import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tenantPlan, setTenantPlan] = useState("free");

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setTenantPlan(parsed.plan || "free");
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const userData = {
        email, // email entered at login
        role: res.data.role, // "admin" or "user"
        plan: res.data.tenant.plan || "free",
        company: res.data.tenant.company,
        token: res.data.token,
      };

      // ✅ Save in state + localStorage
      setUser(userData);
      setTenantPlan(userData.plan);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);

      setNotes([]);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setNotes([]);
    setTenantPlan("free");
  };

  const handleCreate = (title, content) => {
    setNotes([...notes, { _id: Date.now(), title, content }]);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note._id !== id));
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/upgrade/request",
        { company: user.company, userEmail: user.email },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Bearer required
          },
        }
      );

      alert("Upgrade request sent! Waiting for admin approval.");
    } catch (err) {
      alert(
        "Upgrade request failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // ✅ If not logged in → show login page
  if (!user) return <Login onLogin={handleLogin} />;

  // ✅ If admin → show admin dashboard
  if (user.role === "admin") {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  // ✅ Otherwise → show user (notes) dashboard
  return (
    <Notes
      notes={notes}
      onCreate={handleCreate}
      onDelete={handleDelete}
      tenantPlan={tenantPlan}
      onUpgrade={handleUpgrade}
      onLogout={handleLogout}
      user={user}
    />
  );
}
