
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const displayName =
    user?.nombre ||
    user?.name ||
    user?.nombreCompleto ||
    user?.email ||
    "LabControl User";

  const isAdmin =
    user?.role === "ADMIN" || user?.rol === "ADMIN";

  // Títulos dinámicos según la pantalla actual.
  const pageTitles = {
    "/": {
      title: "Home",
      subtitle: "System Dashboard",
    },
    "/laboratories": {
      title: "Laboratories",
      subtitle: "Explore available computers",
    },
    "/assignments": {
      title: "My Session",
      subtitle: "Manage your equipment assignment",
    },
    "/profile": {
      title: "My Profile",
      subtitle: "Account Information",
    },
  };

  const currentPage =
    pageTitles[location.pathname] || pageTitles["/"];

  // Cerrar sesión.
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Abrir el perfil.
  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="app-layout">

      {/* Menú lateral */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <Monitor size={25} />
          <span>LabControl</span>
        </div>

        <nav className="sidebar-nav">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/laboratories"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Box size={19} />
            <span>Computers</span>
          </NavLink>

          <NavLink
            to="/assignments"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Clock size={19} />
            <span>My Session</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <UserRound size={19} />
            <span>My Profile</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Users size={19} />
              <span>Administrator</span>
            </NavLink>
          )}

        </nav>

        {/* Usuario y cierre de sesión */}
        <div className="sidebar-user">

          <div className="sidebar-user-avatar">
            <UserRound size={20} />
          </div>

          <div className="sidebar-user-info">
            <strong title={displayName}>{displayName}</strong>
            <span>{isAdmin ? "Administrator" : "User"}</span>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>

        </div>
      </aside>

      {/* Área principal */}
      <div className="main-area">

        {/* Encabezado superior */}
        <header className="topbar">

          <div className="topbar-title">
            <h1>{currentPage.title}</h1>
            <p>{currentPage.subtitle}</p>
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

            <button
              type="button"
              className="topbar-avatar"
              onClick={handleProfile}
              title="My Profile"
              aria-label="Open My Profile"
            >
              <UserRound size={20} />
            </button>

          </div>
        </header>

        {/* Contenido de cada página */}
        <main className="main-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
