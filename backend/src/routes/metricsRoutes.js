const Router = require("@koa/router");
const { register } = require("../observability/metrics");

const router = new Router();

router.get("/metrics", async (ctx) => {
  const metricsToken = process.env.METRICS_TOKEN;

  if (
    process.env.NODE_ENV === "production" &&
    (!metricsToken || ctx.get("X-Metrics-Token") !== metricsToken)
  ) {
    ctx.status = 404;
    return;
  }

  ctx.type = register.contentType;
  ctx.body = await register.metrics();
});

module.exports = router;
