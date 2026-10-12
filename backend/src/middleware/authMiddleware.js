const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/apiError");

async function requireAuth(ctx, next) {
  const authorization = ctx.get("Authorization");
  const cookieToken = ctx.cookies.get("auth_token");

  if (!cookieToken && (!authorization || !authorization.startsWith("Bearer "))) {
    sendError(ctx, 401, "AUTHENTICATION_REQUIRED", "Authentication required");
    return;
  }

  const token = cookieToken || authorization.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    ctx.state.user = payload;

    await next();
  } catch {
    sendError(ctx, 401, "INVALID_TOKEN", "Invalid or expired token");
  }
}

module.exports = requireAuth;
