async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    console.error("Unhandled error:", {
      requestId: ctx.state.requestId,
      message: error.message,
      stack: error.stack,
    });

    ctx.status = error.status || 500;
    ctx.set("X-Request-Id", ctx.state.requestId);
    ctx.body = {
      message: ctx.status === 500 ? "Internal server error" : error.message,
    };
  }
}

module.exports = errorHandler;
