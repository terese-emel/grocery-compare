let csrfToken = "";

export function captureCsrfToken(response) {
  const token = response.headers.get("X-CSRF-Token");
  if (token) csrfToken = token;
}

export function getCsrfToken() {
  return csrfToken;
}
