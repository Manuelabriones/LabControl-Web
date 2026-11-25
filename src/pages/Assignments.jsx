
import { useEffect, useState } from "react";
import {
  Monitor,
  Cpu,
  MemoryStick,
  ClipboardList,
  RefreshCw,
  Clock,
  Check,
  X,
  UserRound,
} from "lucide-react";

import { api } from "../services/api";
import "../styles/assignments.css";

const Assignments = () => {
  const [computers, setComputers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [userId, setUserId] = useState(null);

  const [materia, setMateria] = useState("");
  const [horasUso, setHorasUso] = useState("2");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Obtener los datos del usuario que inició sesión.
  const loadUser = async () => {
    const data = await api("/api/auth/me");
    const user = data.user || data;

    const id =
      user.userId ||
      user.id ||
      user._id;

    if (!id) {
      throw new Error("Could not identify the logged-in user.");
    }

    setUserId(id);
    return id;
  };

  // Obtener las computadoras disponibles.
  const loadComputers = async () => {
    const data = await api("/api/labs/computers");

    const list = Array.isArray(data)
      ? data
      : data.computers || data.data || [];

    setComputers(list);

    // Seleccionar automáticamente la primera computadora disponible.
    const available = list.filter(
      (computer) => computer.estatus === "DISPONIBLE"
    );

    setSelectedComputer((current) => {
      if (
        current &&
        available.some((computer) => computer.id === current.id)
      ) {
        return current;
      }

      return available[0] || null;
    });
  };

  // Obtener las asignaciones del usuario.
  const loadAssignments = async () => {
    const data = await api("/api/labs/assignments");

    setAssignments(
      Array.isArray(data)
        ? data
        : data.assignments || data.data || []
    );
  };

  // Cargar toda la información de la pantalla.
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await loadUser();
      await loadComputers();
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Could not load the information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Registrar una nueva asignación.
  const handleAssign = async (event) => {
    event.preventDefault();

    if (!selectedComputer) {
      setError("Please select an available computer.");
      return;
    }

    if (!materia.trim()) {
      setError("Please enter the subject.");
      return;
    }

    if (!horasUso || Number(horasUso) < 1) {
      setError("Usage hours must be at least 1.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api("/api/labs/assignments", {
        method: "POST",
        body: JSON.stringify({
          computerId: selectedComputer.id,
          userId,
          materia: materia.trim(),
          horasUso: Number(horasUso),
        }),
      });

      setSuccess("Computer assigned successfully!");
      setMateria("");
      setHorasUso("2");

      await loadComputers();
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Could not assign the computer.");
    } finally {
      setSaving(false);
    }
  };

  // Liberar la computadora asignada al usuario.
  const handleRelease = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to release this computer?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api(`/api/labs/assignments/${assignmentId}/release`, {
        method: "PATCH",
        body: JSON.stringify({
          reporteFalla: false,
          descripcionFalla: "",
        }),
      });

      setSuccess("Computer released successfully!");

      await loadComputers();
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Could not release the computer.");
    }
  };

  // Actualizar la computadora seleccionada.
  const handleSelectComputer = (computer) => {
    setSelectedComputer(computer);
    setError("");
    setSuccess("");
  };

  const availableComputers = computers.filter(
    (computer) => computer.estatus === "DISPONIBLE"
  );

  const activeAssignments = assignments.filter(
    (assignment) => assignment.estatus === "ASIGNADA"
  );

  return (
    <div className="assignment-page">

      {/* Botón para actualizar la información */}
      <div className="assignment-toolbar">
        <button
          type="button"
          className="assignment-refresh"
          onClick={loadData}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="assignment-message error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="assignment-message success-message">
          {success}
        </div>
      )}

      {loading ? (
        <p className="assignment-loading">Loading information...</p>
      ) : (
        <>
          <section className="assignment-content">

            {/* Lista de computadoras disponibles */}
            <div className="computer-card">
              {selectedComputer ? (
                <>
                  <div className="computer-card-top">
                    <div className="computer-icon">
                      <Monitor size={34} />
                    </div>

                    <div>
                      <h2>
                        {selectedComputer.numeroInventario ||
                          selectedComputer.pc ||
                          `Computer ${selectedComputer.id}`}
                      </h2>

                      <span className="computer-available">
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="computer-details">
                    <p>
                      <Monitor size={16} />
                      <strong>Laboratory:</strong>
                      <span>
                        {selectedComputer.laboratorio || "N/A"}
                      </span>
                    </p>

                    <p>
                      <Cpu size={16} />
                      <strong>Processor:</strong>
                      <span>
                        {selectedComputer.especificaciones?.procesador ||
                          selectedComputer.procesador ||
                          "N/A"}
                      </span>
                    </p>

                    <p>
                      <MemoryStick size={16} />
                      <strong>RAM:</strong>
                      <span>
                        {selectedComputer.especificaciones?.ram ||
                          selectedComputer.ram ||
                          "N/A"}
                      </span>
                    </p>

                    <p>
                      <ClipboardList size={16} />
                      <strong>Inventory:</strong>
                      <span>
                        {selectedComputer.numeroInventario || "N/A"}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="no-computer">
                  <Monitor size={40} />
                  <h3>No computers available</h3>
                  <p>There are currently no available computers.</p>
                </div>
              )}
            </div>

            {/* Formulario de asignación */}
            <form className="assignment-form" onSubmit={handleAssign}>
              <div className="assignment-form-title">
                <UserRound size={19} />
                <h2>Assignment Details</h2>
              </div>

              <div className="assignment-field">
                <label htmlFor="computer">
                  Available Computer <span>*</span>
                </label>

                <select
                  id="computer"
                  value={selectedComputer?.id || ""}
                  onChange={(event) => {
                    const computer = availableComputers.find(
                      (item) =>
                        String(item.id) === event.target.value
                    );

                    handleSelectComputer(computer || null);
                  }}
                  required
                >
                  {availableComputers.length === 0 ? (
                    <option value="">No computers available</option>
                  ) : (
                    availableComputers.map((computer) => (
                      <option key={computer.id} value={computer.id}>
                        {computer.numeroInventario ||
                          computer.pc ||
                          `Computer ${computer.id}`}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="assignment-field">
                <label htmlFor="subject">
                  Subject <span>*</span>
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="Enter your subject"
                  value={materia}
                  onChange={(event) => setMateria(event.target.value)}
                  required
                />
              </div>

              <div className="assignment-field">
                <label htmlFor="hours">
                  Usage Hours <span>*</span>
                </label>

                <div className="hours-input">
                  <Clock size={17} />

                  <input
                    id="hours"
                    type="number"
                    min="1"
                    max="12"
                    value={horasUso}
                    onChange={(event) => setHorasUso(event.target.value)}
                    required
                  />

                  <span>hours</span>
                </div>
              </div>

              <div className="assignment-actions">
                <button
                  type="button"
                  className="assignment-cancel"
                  onClick={() => {
                    setMateria("");
                    setHorasUso("2");
                    setError("");
                    setSuccess("");
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="assignment-submit"
                  disabled={
                    saving ||
                    !selectedComputer ||
                    availableComputers.length === 0
                  }
                >
                  <Check size={17} />
                  {saving ? "Assigning..." : "Assign Equipment"}
                </button>
              </div>
            </form>
          </section>

          {/* Mis asignaciones activas */}
          <section className="my-assignments">
            <div className="my-assignments-header">
              <div>
                <h2>My Session</h2>
                <p>Manage your active computer assignments</p>
              </div>

              <span className="active-count">
                {activeAssignments.length} active
              </span>
            </div>

            {activeAssignments.length === 0 ? (
              <p className="empty-assignments">
                You don't have any active assignments.
              </p>
            ) : (
              <div className="active-assignment-list">
                {activeAssignments.map((assignment) => (
                  <article
                    className="active-assignment-card"
                    key={assignment.assignmentId}
                  >
                    <div className="active-assignment-icon">
                      <Monitor size={23} />
                    </div>

                    <div className="active-assignment-info">
                      <h3>{assignment.pc || assignment.computerId}</h3>
                      <p>
                        Laboratory: {assignment.laboratorio || "N/A"}
                      </p>
                      <p>Subject: {assignment.materia}</p>
                      <p>Usage hours: {assignment.horasUso}</p>

                      <span className="computer-available">
                        {assignment.estatus}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="release-button"
                      onClick={() =>
                        handleRelease(assignment.assignmentId)
                      }
                    >
                      Release Computer
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Assignments;
