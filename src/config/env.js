export const API_URL = import.meta.env.VITE_API_URL;
export const API_APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

// Validar que las variables de entorno existan
if (!API_URL || !API_APP_TOKEN) {
  throw new Error("API configuration is missing. Check your .env file.");
}
