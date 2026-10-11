const authService = require("../services/authService");

async function register(ctx) {
  const { email, password } = ctx.request.body || {};

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = {
      message: "Email and password are required",
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

  if (!email || !password) {
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

module.exports = {
  register,
  login,
};
