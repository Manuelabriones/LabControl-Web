
import { NavLink } from "react-router-dom";
import {
  Monitor,
  LayoutDashboard,
  Box,
  Clock,
  Users,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const userName =
    user?.nombre ||
    user?.name ||
    user?.email ||
    "LabControl User";

  const userRole = user?.rol || user?.role || "USER";

  const menuItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Laboratories",
      path: "/laboratories",
      icon: Box,
    },
    {
      name: "My Session",
      path: "/assignments",
      icon: Clock,
    },
    ...(userRole === "ADMIN"
      ? [
          {
            name: "Administrator",
            path: "/profile",
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Monitor size={21} />
        <span>LabControl</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          <UserRound size={19} />
        </div>

        <div className="profile-info">
          <strong>{userName}</strong>
          <span>{userRole}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
