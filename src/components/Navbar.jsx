
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  ClipboardList,
  UserRound,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <Monitor size={27} />
        <span>LabControl</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/laboratories" className="sidebar-link">
          <Monitor size={19} />
          <span>Computers</span>
        </NavLink>

        <NavLink to="/assignments" className="sidebar-link">
          <ClipboardList size={19} />
          <span>My Requests</span>
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <UserRound size={19} />
          <span>My Profile</span>
        </NavLink>
      </nav>

      {/* User information */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          <UserRound size={20} />
        </div>

        <div className="sidebar-user-info">
          <strong>
            {user?.nombre || user?.name || user?.email || "User"}
          </strong>
          <span>{user?.rol || user?.role || "User"}</span>
        </div>
      </div>

      {/* Logout */}
      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Navbar;
