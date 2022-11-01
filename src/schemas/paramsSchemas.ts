import Joi from "joi";

export const paramsIdSchema = Joi.string()
  .pattern(/[0-9]/)
  .required()
  .label("id");
