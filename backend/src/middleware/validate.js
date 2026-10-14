const { sendError } = require("../utils/apiError");

const validate = (schema, source, message) => async (ctx, next) => {
  const result = schema.safeParse(ctx.request[source] || ctx[source]);

  if (!result.success) {
    const detail = message || result.error.issues[0]?.message || "Invalid request data";
    sendError(ctx, 400, "VALIDATION_ERROR", detail);
    return;
  }

  ctx.state.validated = ctx.state.validated || {};
  ctx.state.validated[source] = result.data;
  await next();
};

module.exports = validate;
