const jwt = require("jsonwebtoken");

async function requireAuth(ctx, next) {
  const authorization = ctx.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = {
      message: "Authentication required",
    };
    return;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    ctx.state.user = payload;

    await next();
  } catch {
    ctx.status = 401;
    ctx.body = {
      message: "Invalid or expired token",
    };
  }
}

module.exports = requireAuth;
