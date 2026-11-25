
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Monitor,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthIllustration from "../components/AuthIllustration";
import "../styles/auth.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.nombre ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Confirmar después los campos exactos que requiere la API
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-section">
        <p className="auth-section-label">Create Account</p>

        <div className="auth-layout">
          <aside className="auth-brand-panel">
            <div className="brand-content">
              <Monitor size={43} strokeWidth={1.7} />

              <h1>LabControl</h1>

              <p>
                Computer Laboratory
                <br />
                Management System
              </p>
            </div>

            <div className="brand-wave" />

            <div className="illustration-container">
              <AuthIllustration type="laptop" />
            </div>
          </aside>

          <div className="auth-form-panel">
            <div className="auth-form-card register-card">
              <header className="auth-heading">
                <h2>Create Account</h2>
                <p>Register a new user</p>
              </header>

              <form onSubmit={handleSubmit}>
                <div className="auth-input">
                  <UserRound size={15} />
                  <input
                    name="nombre"
                    placeholder="Full Name"
                    value={formData.nombre}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="auth-input">
                  <Mail size={15} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                <div className="auth-input">
                  <LockKeyhole size={15} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <div className="auth-input">
                  <LockKeyhole size={15} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <UserPlus size={16} />
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <footer className="auth-card-footer">
                <span>Already have an account?</span>
                <Link to="/login">Log In</Link>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
