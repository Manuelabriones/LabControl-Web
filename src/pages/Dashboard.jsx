
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  CheckCircle,
  XCircle,
  Wrench,
  Zap,
  UserPlus,
  Clock,
} from "lucide-react";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user information
  const currentUser = {
    name:
      user?.nombre ||
      user?.name ||
      user?.email ||
      user?.matricula ||
      "User",
    role: user?.rol || user?.role || "USER",
  };

  // Load computers from the API
  useEffect(() => {
    const loadComputers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api("/api/labs/computers");

        const computerList = Array.isArray(data)
          ? data
          : data.computers || data.data || [];

        setComputers(computerList);
      } catch (err) {
        console.error("Error loading computers:", err);
        setError(err.message || "Unable to load computers.");
      } finally {
        setLoading(false);
      }
    };

    loadComputers();
  }, []);

  // Calculate computer statistics
  const statistics = [
    {
      title: "Total Computers",
      value: computers.length,
      icon: Monitor,
      className: "stat-total",
    },
    {
      title: "Available",
      value: computers.filter(
        (computer) => computer.estatus === "DISPONIBLE"
      ).length,
      icon: CheckCircle,
      className: "stat-available",
    },
    {
      title: "Occupied",
      value: computers.filter(
        (computer) => computer.estatus === "OCUPADA"
      ).length,
      icon: XCircle,
      className: "stat-occupied",
    },
    {
      title: "In Maintenance",
      value: computers.filter(
        (computer) => computer.estatus === "MANTENIMIENTO"
      ).length,
      icon: Wrench,
      className: "stat-maintenance",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "View Laboratories",
      description: "Explore available computers",
      path: "/laboratories",
      icon: Monitor,
    },
    {
      title: "Assign Equipment",
      description: "Request a computer",
      path: "/laboratories",
      icon: UserPlus,
    },
    {
      title: "My Active Session",
      description: "Check your current assignment",
      path: "/assignments",
      icon: Clock,
    },
  ];

  return (
    <div className="dashboard-content">

      {/* Welcome */}
      <section className="welcome-card">
        <div className="welcome-text">
          <h2>Welcome, {currentUser.name}!</h2>

          <p>
            Manage laboratories, equipment and assignments from a
            single place.
          </p>
        </div>

        <div className="welcome-illustration">
          <Monitor size={55} strokeWidth={1.5} />
        </div>
      </section>

      {/* Statistics */}
      <section className="statistics-grid">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className={`stat-card ${stat.className}`}
              key={stat.title}
            >
              <Icon size={18} strokeWidth={2.2} />

              <strong>
                {loading ? "..." : stat.value}
              </strong>

              <span>{stat.title}</span>
            </article>
          );
        })}
      </section>

      {/* API Error */}
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2 className="section-title">
          <Zap size={16} />
          Quick Actions
        </h2>

        <div className="quick-actions-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                to={action.path}
                className="quick-action-card"
                key={action.title}
              >
                <Icon size={22} strokeWidth={1.7} />

                <strong>{action.title}</strong>

                <span>{action.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
