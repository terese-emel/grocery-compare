import { logout } from "./authApi";
import { captureCsrfToken, getCsrfToken } from "./csrf";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, { code, requestId, status } = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(getCsrfToken() ? { "X-CSRF-Token": getCsrfToken() } : {}),
      ...options.headers,
    },
  });
  captureCsrfToken(response);

  const data = await response.json();

  if (response.status === 401) {
    void logout().catch(() => {});
  }

  if (!response.ok) {
    throw new ApiError(data.error?.message || data.message || "Request failed", {
      code: data.error?.code,
      requestId:
        data.error?.requestId || response.headers?.get?.("X-Request-Id"),
      status: response.status,
    });
  }

  return data;
}
