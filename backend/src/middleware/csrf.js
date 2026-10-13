const crypto = require("crypto");

const csrfCookieName = "csrf_token";
const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

function csrfCookieOptions() {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };
}

function ensureCsrfToken(ctx) {
  const existingToken = ctx.cookies.get(csrfCookieName);

  if (existingToken) {
    return existingToken;
  }

  const token = crypto.randomBytes(32).toString("hex");
  ctx.cookies.set(csrfCookieName, token, csrfCookieOptions());
  return token;
}

function tokensMatch(expected, received) {
  if (!expected || !received || expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(received),
  );
}

async function csrfProtection(ctx, next) {
  const csrfToken = ensureCsrfToken(ctx);
  ctx.set("X-CSRF-Token", csrfToken);

  if (
    safeMethods.has(ctx.method) ||
    ctx.path === "/auth/login" ||
    ctx.path === "/auth/register" ||
    ctx.path === "/auth/csrf"
  ) {
    await next();
    return;
  }

  // Bearer-token clients are not vulnerable to browser cookie CSRF.
  if (!ctx.cookies.get("auth_token")) {
    await next();
    return;
  }

  const expectedToken = ctx.cookies.get(csrfCookieName);
  const receivedToken = ctx.get("X-CSRF-Token");

  if (!tokensMatch(expectedToken, receivedToken)) {
    ctx.status = 403;
    ctx.body = {
      message: "Invalid CSRF token",
      error: {
        code: "INVALID_CSRF_TOKEN",
        message: "Invalid CSRF token",
        requestId: ctx.state.requestId,
      },
    };
    return;
  }

  await next();
}

module.exports = csrfProtection;
