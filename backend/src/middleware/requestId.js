const crypto = require("crypto");

async function requestId(ctx, next) {
  const requestId = ctx.get("X-Request-Id") || crypto.randomUUID();

  ctx.state.requestId = requestId;
  ctx.set("X-Request-Id", requestId);

  await next();
}

module.exports = requestId;
