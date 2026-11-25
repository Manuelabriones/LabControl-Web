
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Monitor,
  LayoutDashboard,
  Box,
  Clock,
  Users,
  Bell,
  UserRound,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.nombre ||
    user?.name ||
    user?.nombreCompleto ||
    user?.email ||
    "LabControl User";

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Monitor size={23} />
          <span>LabControl</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }>
            <LayoutDashboard size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/laboratories" className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }>
            <Box size={18} />
            <span>Laboratories</span>
          </NavLink>

          <NavLink to="/assignments" className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }>
            <Clock size={18} />
            <span>My Session</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/profile" className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }>
              <Users size={18} />
              <span>Administrator</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <UserRound size={19} />
          </div>

          <div className="sidebar-user-info">
            <strong>{displayName}</strong>
            <span>{isAdmin ? "Administrator" : "User"}</span>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <h1>Home</h1>
            <p>System Dashboard</p>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="topbar-avatar">
              <UserRound size={20} />
            </div>
          </div>
        </header>

        <section className="main-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
