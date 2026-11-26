
import { useEffect, useState } from "react";
import {
  Monitor,
  FlaskConical,
  BookOpen,
  CalendarDays,
  Clock,
  LogOut,
  Upload,
  RefreshCw,
} from "lucide-react";

import { api } from "../services/api";
import "../styles/assignments.css";

const Assignments = () => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);

  const [reportIssue, setReportIssue] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Obtener las asignaciones del usuario autenticado.
  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError("");

      // Consultar las asignaciones del usuario.
      const data = await api("/api/labs/assignments");

      const list = Array.isArray(data)
        ? data
        : data.assignments || data.data || [];

      // Buscar únicamente la computadora que sigue asignada.
      const active = list.find(
        (item) => item.estatus === "ASIGNADA"
      );

      setAssignment(active || null);
    } catch (err) {
      setError(
        err.message || "Could not load the active session."
      );
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  };

  // Cargar la sesión al entrar a la pantalla.
  useEffect(() => {
    loadAssignment();
  }, []);

  // Liberar la computadora asignada.
  const handleRelease = async () => {
    if (!assignment) return;

    if (reportIssue && issueDescription.trim().length < 5) {
      setError("Please describe the issue with at least 5 characters.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to release this computer?"
    );

    if (!confirmed) return;

    try {
      setReleasing(true);
      setError("");
      setSuccess("");

      await api(
        `/api/labs/assignments/${assignment.assignmentId}/release`,
        {
          method: "PATCH",
          body: JSON.stringify({
            reporteFalla: reportIssue,
            descripcionFalla: reportIssue
              ? issueDescription.trim()
              : "",
          }),
        }
      );

      setSuccess("Equipment released successfully!");
      setReportIssue(false);
      setIssueDescription("");

      await loadAssignment();
    } catch (err) {
      setError(
        err.message || "Could not release the equipment."
      );
    } finally {
      setReleasing(false);
    }
  };

  // Obtener el nombre de la computadora.
  const computerName =
    assignment?.pc ||
    assignment?.computer?.nombre ||
    assignment?.computer?.codigo ||
    assignment?.computerId ||
    "N/A";

  // Obtener la fecha de inicio.
  const startTime =
    assignment?.inicio ||
    assignment?.fechaAsignacion ||
    assignment?.createdAt ||
    assignment?.fechaInicio;

  // Formatear la fecha.
  const formatStartTime = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="active-session-page">

      {/* Mensajes */}
      {error && (
        <div className="session-message session-error">
          {error}
        </div>
      )}

      {success && (
        <div className="session-message session-success">
          {success}
        </div>
      )}

      {loading ? (
        <div className="session-empty">
          <RefreshCw className="session-loading-icon" size={30} />
          <p>Loading active session...</p>
        </div>
      ) : !assignment ? (
        <div className="session-empty">
          <Monitor size={44} />

          <h2>No Active Session</h2>

          <p>
            You don't have an assigned computer at the moment.
          </p>

          <button
            type="button"
            className="session-empty-refresh"
            onClick={loadAssignment}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      ) : (
        <section className="active-session-content">

          {/* Información de la computadora */}
          <article className="session-info-card">

            <div className="session-status-banner">
              <div className="session-computer-icon">
                <Monitor size={30} />
              </div>

              <div className="session-status-content">
                <h3>You have an assigned computer</h3>

                <span className="session-in-use">
                  <span className="session-status-dot"></span>
                  In Use
                </span>
              </div>
            </div>

            {/* Detalles de la sesión */}
            <div className="session-details">

              <div className="session-detail-row">
                <Monitor size={18} />
                <span>Computer:</span>
                <strong>{computerName}</strong>
              </div>

              <div className="session-detail-row">
                <FlaskConical size={18} />
                <span>Laboratory:</span>
                <strong>
                  {assignment.laboratorio ||
                    assignment.laboratory?.nombre ||
                    "N/A"}
                </strong>
              </div>

              <div className="session-detail-row">
                <BookOpen size={18} />
                <span>Subject:</span>
                <strong>{assignment.materia || "N/A"}</strong>
              </div>

              <div className="session-detail-row">
                <CalendarDays size={18} />
                <span>Start Time:</span>
                <strong>{formatStartTime(startTime)}</strong>
              </div>

              <div className="session-detail-row">
                <Clock size={18} />
                <span>Usage Time:</span>
                <strong>
                  {assignment.horasUso
                    ? `${assignment.horasUso} hours`
                    : "N/A"}
                </strong>
              </div>

            </div>
          </article>

          {/* Liberar equipo */}
          <article className="release-equipment-card">

            <div className="release-card-header">
              <Upload size={20} />
              <h2>Release Equipment</h2>
            </div>

            <div className="release-divider"></div>

            {/* Reportar una falla */}
            <label className="report-checkbox">
              <input
                type="checkbox"
                checked={reportIssue}
                onChange={(event) => {
                  setReportIssue(event.target.checked);
                  setError("");

                  if (!event.target.checked) {
                    setIssueDescription("");
                  }
                }}
              />

              <span>Report an equipment issue</span>
            </label>

            {reportIssue && (
              <div className="issue-description-container">
                <label htmlFor="issueDescription">
                  Issue Description <span>*</span>
                </label>

                <textarea
                  id="issueDescription"
                  placeholder="Describe the problem found..."
                  value={issueDescription}
                  onChange={(event) =>
                    setIssueDescription(
                      event.target.value.slice(0, 200)
                    )
                  }
                  maxLength={200}
                />

                <div className="issue-character-count">
                  {issueDescription.length}/200
                </div>
              </div>
            )}

            {/* Botón para liberar */}
            <button
              type="button"
              className="release-equipment-button"
              onClick={handleRelease}
              disabled={releasing}
            >
              <LogOut size={18} />

              {releasing
                ? "Releasing..."
                : "Release Equipment"}
            </button>

          </article>
        </section>
      )}
    </div>
  );
};

export default Assignments;
