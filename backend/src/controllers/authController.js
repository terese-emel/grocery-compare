const authService = require("../services/authService");
const { loginSchema, registerSchema } = require("../validation/schemas");
const { parseSchema } = require("../validation/parse");

async function register(ctx) {
  const result = parseSchema(registerSchema, ctx.request.body || {});

  if (result.error) {
    ctx.status = 400;
    ctx.body = { message: result.error };
    return;
  }

  const registeredUser = await authService.registerUser(
    result.data.email,
    result.data.password,
  );

  ctx.status = 201;
  ctx.body = registeredUser;
}

async function login(ctx) {
  const result = parseSchema(loginSchema, ctx.request.body || {});

  if (result.error) {
    ctx.status = 400;
    ctx.body = { message: result.error };
    return;
  }

  const loggedInUser = await authService.loginUser(
    result.data.email,
    result.data.password,
  );

  ctx.status = 200;
  ctx.body = loggedInUser;
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
