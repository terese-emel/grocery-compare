function sendError(ctx, status, code, message) {
  ctx.status = status;
  ctx.body = {
    message,
    error: {
      code,
      message,
      requestId: ctx.state.requestId,
    },
  };
}

module.exports = { sendError };
