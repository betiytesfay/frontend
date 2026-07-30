export const validateWithZod = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formattedErrors = result.error.errors.map(err => err.message).join("\n");
    return { success: false, errors: formattedErrors, errorObj: result.error };
  }
  return { success: true, data: result.data };
};
