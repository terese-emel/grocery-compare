function parseSchema(schema, value) {
  const result = schema.safeParse(value);

  if (result.success) {
    return { data: result.data };
  }

  return {
    error: result.error.issues[0]?.message || "Invalid request data",
  };
}

module.exports = { parseSchema };
