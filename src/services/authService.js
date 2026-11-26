import { api } from "./api";

const TOKEN_KEY = "labcontrol_token";

// Registrar un usuario
export const register = async (userData) => {
  return api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// Iniciar sesi├│n
export const login = async (credentials) => {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Extraer el JWT de la respuesta
  const token =
    data.token ||
    data.accessToken ||
    data.access_token;

  if (!token) {
    throw new Error("Login response does not contain a valid token.");
  }

  sessionStorage.setItem(TOKEN_KEY, token);

  return data;
};

// Obtener informaci├│n del usuario
export const getCurrentUser = async () => {
  return api("/api/auth/me");
};

// Cerrar sesi├│n
export const logout = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};
