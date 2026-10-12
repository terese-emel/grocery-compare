const authService = require("../services/authService");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

async function register(ctx) {
  const { email, password } = ctx.state.validated.body;

  const registeredUser = await authService.registerUser(
    email,
    password,
  );

  ctx.cookies.set("auth_token", registeredUser.token, cookieOptions);

  ctx.status = 201;
  ctx.body = { user: registeredUser.user };
}

async function login(ctx) {
  const { email, password } = ctx.state.validated.body;

  const loggedInUser = await authService.loginUser(
    email,
    password,
  );

  ctx.cookies.set("auth_token", loggedInUser.token, cookieOptions);

  ctx.status = 200;
  ctx.body = { user: loggedInUser.user };
}

function logout(ctx) {
  ctx.cookies.set("auth_token", null, {
    ...cookieOptions,
    maxAge: 0,
  });
  ctx.status = 200;
  ctx.body = { message: "Logged out successfully" };
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
  logout,
  getCurrentUser,
};
