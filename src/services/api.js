import { API_URL, API_APP_TOKEN } from "../config/env";

const TOKEN_KEY = "labcontrol_token";

export const api = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  const headers = {
    "x-api-token": API_APP_TOKEN,
    ...options.headers,
  };

  // Agregar el token JWT solamente cuando exista una sesión
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Agregar Content-Type únicamente cuando se envíe un cuerpo JSON
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth-expired"));
    }

    const error = new Error(
      data.message || "Something went wrong."
    );

    error.status = response.status;
    error.code = data.code;
    error.errors = data.errors || [];

    throw error;
  }

  return data;
};
