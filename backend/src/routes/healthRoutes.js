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

module.exports = router;
