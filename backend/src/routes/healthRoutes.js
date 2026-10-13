const Router = require("@koa/router");
const mongoose = require("mongoose");

const router = new Router();

router.get("/health", (ctx) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  ctx.status = databaseConnected ? 200 : 503;
  ctx.body = {
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  };
});

router.get("/live", (ctx) => {
  ctx.status = 200;
  ctx.body = { status: "ok" };
});

router.get("/ready", (ctx) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  ctx.status = databaseConnected ? 200 : 503;
  ctx.body = {
    status: databaseConnected ? "ready" : "not ready",
    database: databaseConnected ? "connected" : "disconnected",
  };
});

module.exports = router;
