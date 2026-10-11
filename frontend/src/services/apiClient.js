import { getAuthToken, logout } from "./authApi";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (response.status === 401) {
    logout();
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
