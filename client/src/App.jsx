import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ContactModal from "./components/ContactModal";

import About from "./pages/About";
import Works from "./pages/Works";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminProjects from "./pages/AdminProjects";
import AdminCerts from "./pages/AdminCerts";

import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

// Layout – hides navbar on admin pages
function Layout({ children, openContact }) {
  const location = useLocation();
  const adminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!adminPage && <Navbar openContact={openContact} />}
      {children}
    </>
  );
}

export default function App() {
  const [showContact, setShowContact] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout openContact={() => setShowContact(true)}>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />

          {/* ADMIN */}
          <Route path="/admin" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs/new"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs/edit/:id"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute>
                <AdminCerts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>

      {!window.location.pathname.startsWith("/admin") &&
        showContact && (
          <ContactModal close={() => setShowContact(false)} />
        )}
    </BrowserRouter>
  );
}
