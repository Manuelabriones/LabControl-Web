
import { useEffect, useMemo, useState } from "react";
import {
  Monitor,
  FlaskConical,
  Layers,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react";

import { api } from "../services/api";
import "../styles/laboratories.css";

const Laboratories = () => {
  const [computers, setComputers] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [selectedLab, setSelectedLab] = useState("Lab-A");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Display names used by the Figma design
  const displayNames = {
    Redes: "Networks",
    Networks: "Networks",
  };

  // Load computers and laboratories from the API
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [computerData, labData] = await Promise.all([
        api("/api/labs/computers"),
        api("/api/labs/computers/labs"),
      ]);

      const computerList = Array.isArray(computerData)
        ? computerData
        : computerData.computers || computerData.data || [];

      const labList = Array.isArray(labData)
        ? labData
        : labData.laboratorios || labData.labs || labData.data || [];

      const normalizedLabs = labList
        .map((lab) =>
          typeof lab === "string"
            ? lab
            : lab.nombre || lab.laboratorio
        )
        .filter(Boolean);

      setComputers(computerList);
      setLaboratories(normalizedLabs);

      // Select the first laboratory returned by the API
      if (normalizedLabs.length > 0) {
        setSelectedLab((current) =>
          normalizedLabs.includes(current)
            ? current
            : normalizedLabs[0]
        );
      }
    } catch (err) {
      console.error("Error loading laboratories:", err);
      setError(err.message || "Unable to load computer laboratories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter computers by selected laboratory
  const filteredComputers = useMemo(() => {
    return computers.filter(
      (computer) => computer.laboratorio === selectedLab
    );
  }, [computers, selectedLab]);

  // Calculate statistics for the selected laboratory
  const statistics = useMemo(() => {
    return {
      available: filteredComputers.filter(
        (computer) => computer.estatus === "DISPONIBLE"
      ).length,

      occupied: filteredComputers.filter(
        (computer) => computer.estatus === "OCUPADA"
      ).length,

      maintenance: filteredComputers.filter(
        (computer) => computer.estatus === "MANTENIMIENTO"
      ).length,
    };
  }, [filteredComputers]);

  // Status information
  const getStatus = (status) => {
    switch (status) {
      case "DISPONIBLE":
        return {
          label: "Available",
          className: "status-available",
          icon: CheckCircle,
        };

      case "OCUPADA":
        return {
          label: "Occupied",
          className: "status-occupied",
          icon: XCircle,
        };

      case "MANTENIMIENTO":
        return {
          label: "Maintenance",
          className: "status-maintenance",
          icon: Wrench,
        };

      default:
        return {
          label: status || "Unknown",
          className: "status-unknown",
          icon: Monitor,
        };
    }
  };

  // Laboratory selector icons
  const getLabIcon = (lab) => {
    const name = displayNames[lab] || lab;

    if (name === "Networks") {
      return Layers;
    }

    return Monitor;
  };

  return (
    <div className="laboratories-page">
      {/* Laboratory selector and catalog */}
      <section className="laboratories-panel">

        {/* Select a laboratory */}
        <div className="laboratory-selector">
          <h2>
            <FlaskConical size={17} />
            Select a Laboratory
          </h2>

          <div className="laboratory-tabs">
            {laboratories.map((lab) => {
              const Icon = getLabIcon(lab);
              const displayName = displayNames[lab] || lab;

              return (
                <button
                  type="button"
                  key={lab}
                  className={`laboratory-tab ${
                    selectedLab === lab ? "active" : ""
                  }`}
                  onClick={() => setSelectedLab(lab)}
                >
                  <Icon size={16} />
                  <span>{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status overview */}
        <div className="laboratory-statistics">
          <article className="laboratory-stat available">
            <div className="laboratory-stat-heading">
              <CheckCircle size={15} />
              <span>Available</span>
            </div>

            <strong>
              {loading ? "..." : statistics.available}
            </strong>
          </article>

          <article className="laboratory-stat occupied">
            <div className="laboratory-stat-heading">
              <XCircle size={15} />
              <span>Occupied</span>
            </div>

            <strong>
              {loading ? "..." : statistics.occupied}
            </strong>
          </article>

          <article className="laboratory-stat maintenance">
            <div className="laboratory-stat-heading">
              <Wrench size={15} />
              <span>Maintenance</span>
            </div>

            <strong>
              {loading ? "..." : statistics.maintenance}
            </strong>
          </article>
        </div>

        {/* Computer catalog */}
        <div className="laboratory-computer-grid">
          {loading ? (
            <div className="laboratory-message">
              Loading computers...
            </div>
          ) : error ? (
            <div className="laboratory-message laboratory-error">
              <p>{error}</p>

              <button type="button" onClick={loadData}>
                Try Again
              </button>
            </div>
          ) : filteredComputers.length === 0 ? (
            <div className="laboratory-message">
              No computers found in this laboratory.
            </div>
          ) : (
            filteredComputers.map((computer) => {
              const status = getStatus(computer.estatus);
              const StatusIcon = status.icon;

              return (
                <article
                  className="laboratory-computer-card"
                  key={computer.id}
                >
                  <div className="computer-card-icon">
                    <Monitor size={27} strokeWidth={1.8} />
                  </div>

                  <div className="computer-card-information">
                    <h3>{computer.numeroInventario}</h3>

                    <p className="computer-specifications">
                      {computer.especificaciones ||
                        "Specifications unavailable"}
                    </p>

                    <p className="computer-laboratory-name">
                      {displayNames[computer.laboratorio] ||
                        computer.laboratorio}
                    </p>
                  </div>

                  <div
                    className={`computer-card-status ${status.className}`}
                  >
                    <StatusIcon size={11} />
                    <span>{status.label}</span>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Laboratories;
