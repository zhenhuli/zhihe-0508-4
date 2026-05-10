const DEFAULT_SERVER_PORT = parseInt(import.meta.env.VITE_SERVER_PORT) || 3001;

export function getServerUrl() {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  return `http://localhost:${DEFAULT_SERVER_PORT}`;
}

export const SERVER_URL = getServerUrl();
