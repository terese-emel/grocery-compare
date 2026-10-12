import { logout } from "./authApi";

const API_URL = import.meta.env.VITE_API_URL;

function getCsrfToken() {
  const csrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf_token="));

  return csrfCookie ? decodeURIComponent(csrfCookie.split("=")[1]) : null;
}

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
  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...options.headers,
    },
  });

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
