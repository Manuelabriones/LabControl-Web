import { useEffect, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import { api } from "../services/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/api/labs/assignments");

      setAssignments(
        Array.isArray(data) ? data : data.assignments || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleRelease = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to release this computer?"
    );

    if (!confirmed) return;

    try {
      await api(`/api/labs/assignments/${assignmentId}/release`, {
        method: "PATCH",
        body: JSON.stringify({
          reporteFalla: false,
          descripcionFalla: "",
        }),
      });

      await loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>My Requests</h1>
            <p>Manage your computer assignments.</p>
          </div>

          <button className="secondary-button" onClick={loadAssignments}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        {loading && <p>Loading assignments...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <section className="assignment-list">
            {assignments.map((assignment) => (
              <article className="assignment-card" key={assignment.assignmentId}>
                <ClipboardList size={30} />

                <div className="assignment-info">
                  <h3>{assignment.pc || assignment.computerId}</h3>
                  <p>Laboratory: {assignment.laboratorio}</p>
                  <p>Subject: {assignment.materia}</p>
                  <p>Estimated hours: {assignment.horasUso}</p>
                  <span className="status">
                    {assignment.estatus}
                  </span>
                </div>

                {assignment.estatus === "ASIGNADA" && (
                  <button
                    className="secondary-button"
                    onClick={() => handleRelease(assignment.assignmentId)}
                  >
                    Release Computer
                  </button>
                )}
              </article>
            ))}

            {assignments.length === 0 && (
              <p>You don't have any assignments yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Assignments;
