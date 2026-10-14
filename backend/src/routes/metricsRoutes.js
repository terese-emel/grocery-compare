const Router = require("@koa/router");
const { register } = require("../observability/metrics");

const router = new Router();

router.get("/metrics", async (ctx) => {
  ctx.type = register.contentType;
  ctx.body = await register.metrics();
});

module.exports = router;
