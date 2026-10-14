const {
  httpRequestDuration,
  httpRequestsTotal,
} = require("../observability/metrics");

function getRouteLabel(ctx) {
  return ctx._matchedRoute || ctx.path;
}

async function metricsMiddleware(ctx, next) {
  const startTime = process.hrtime.bigint();

  try {
    await next();
  } finally {
    const durationInSeconds =
      Number(process.hrtime.bigint() - startTime) / 1_000_000_000;

    const labels = {
      method: ctx.method,
      route: getRouteLabel(ctx),
      status_code: String(ctx.status),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, durationInSeconds);
  }
}

module.exports = metricsMiddleware;
