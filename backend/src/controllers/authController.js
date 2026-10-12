const authService = require("../services/authService");

async function register(ctx) {
  const { email, password } = ctx.state.validated.body;

  const registeredUser = await authService.registerUser(
    email,
    password,
  );

  ctx.status = 201;
  ctx.body = registeredUser;
}

async function login(ctx) {
  const { email, password } = ctx.state.validated.body;

  const loggedInUser = await authService.loginUser(
    email,
    password,
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
