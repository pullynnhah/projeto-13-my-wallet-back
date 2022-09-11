import joi from "joi";

const signupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  repeatPassword: joi.ref("password"),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export {signupSchema, loginSchema};
