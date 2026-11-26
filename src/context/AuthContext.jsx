import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar si existe una sesi├│n guardada
    const checkSession = async () => {
      const token = sessionStorage.getItem("labcontrol_token");

      if (token) {
        try {
          const data = await getCurrentUser();
          setUser(data.user || data);
        } catch {
          logoutService();
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkSession();

    const handleExpired = () => {
      setUser(null);
    };

    window.addEventListener("auth-expired", handleExpired);

    return () => {
      window.removeEventListener("auth-expired", handleExpired);
    };
  }, []);

  const login = async (credentials) => {
    await loginService(credentials);

    const data = await getCurrentUser();
    setUser(data.user || data);

    return data;
  };

  const register = async (userData) => {
    return registerService(userData);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
