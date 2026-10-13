let csrfToken = "";

export function captureCsrfToken(response) {
  const token = response.headers?.get?.("X-CSRF-Token");
  if (token) csrfToken = token;
}

export function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const csrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf_token="));

  return csrfCookie ? decodeURIComponent(csrfCookie.split("=")[1]) : "";
}
