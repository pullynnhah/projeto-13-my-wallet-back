import joi from "joi";

const walletSchema = joi.object({
  amount: joi.number().positive().precision(2).required(),
  description: joi.string().required(),
  type: joi.valid("income", "expense").required(),
});

export {walletSchema};
