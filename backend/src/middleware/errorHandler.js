async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    console.error("Unhandled error:", error);

    ctx.status = error.status || 500;
    ctx.body = {
      message: ctx.status === 500 ? "Internal server error" : error.message,
    };
  }
}

module.exports = errorHandler;
