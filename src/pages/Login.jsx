
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Monitor,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthIllustration from "../components/AuthIllustration";
import "../styles/auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-section">
        <p className="auth-section-label">Sign In</p>

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
              <AuthIllustration type="computer" />
            </div>
          </aside>

          <div className="auth-form-panel">
            <div className="auth-form-card">
              <header className="auth-heading">
                <h2>Sign In</h2>
                <p>Access to LabControl</p>
              </header>

              <form onSubmit={handleSubmit}>
                <div className="auth-input">
                  <Mail size={15} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="auth-input">
                  <LockKeyhole size={15} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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

                <div className="auth-options">
                  <label className="remember-option">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>

                  <Link to="/forgot-password">
                    Forgot your password?
                  </Link>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <LogIn size={16} />
                  {loading ? "Signing In..." : "Log In"}
                </button>
              </form>

              <footer className="auth-card-footer">
                <span>Don't have an account?</span>
                <Link to="/register">Create Account</Link>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
