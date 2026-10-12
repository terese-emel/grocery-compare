const validate = (schema, source, message) => async (ctx, next) => {
  const result = schema.safeParse(ctx.request[source] || ctx[source]);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = {
      message: message || result.error.issues[0]?.message || "Invalid request data",
    };
    return;
  }

  ctx.state.validated = ctx.state.validated || {};
  ctx.state.validated[source] = result.data;
  await next();
};

module.exports = validate;
