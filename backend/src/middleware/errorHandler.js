const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Unhandled error:", error);

    ctx.status = 500;
    ctx.body = {
      message: "Internal server error",
    };
  }
};

module.exports = errorHandler;
