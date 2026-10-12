const authService = require("../services/authService");

async function register(ctx) {
  const { email, password } = ctx.request.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    ctx.status = 400;
    ctx.body = {
      message: "A valid email and password are required",
    };
    return;
  }

  if (password.length < 8) {
    ctx.status = 400;
    ctx.body = {
      message: "Password must contain at least 8 characters",
    };
    return;
  }

  const result = await authService.registerUser(email, password);

  ctx.status = 201;
  ctx.body = result;
}

async function login(ctx) {
  const { email, password } = ctx.request.body || {};

  if (typeof email !== "string" || typeof password !== "string" || !email.trim()) {
    ctx.status = 400;
    ctx.body = {
      message: "Email and password are required",
    };
    return;
  }

  const result = await authService.loginUser(email, password);

  ctx.status = 200;
  ctx.body = result;
}

async function getCurrentUser(ctx) {
  ctx.status = 200;
  ctx.body = {
    user: {
      id: ctx.state.user.userId,
      email: ctx.state.user.email,
    },
  };
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
