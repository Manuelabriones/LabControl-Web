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
      <div className="brand">
        <Monitor size={27} />
        <h2>LabControl</h2>
      </div>

      <nav className="navigation">
        <NavLink to="/" end>
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink to="/laboratories">
          <Monitor size={19} />
          Computers
        </NavLink>

        <NavLink to="/assignments">
          <ClipboardList size={19} />
          My Requests
        </NavLink>

        <NavLink to="/profile">
          <UserRound size={19} />
          My Profile
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <span>{user?.nombre || user?.name || user?.email || "User"}</span>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
