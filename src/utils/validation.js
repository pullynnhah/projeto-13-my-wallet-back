function validateJOI(schema, body) {
  const validation = schema.validate(body);
  return !validation.error;
}

export {validateJOI};
