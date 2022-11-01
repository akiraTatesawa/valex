import Joi from "joi";
import { CreateCardRequestBody, ActivateCardRequestBody } from "../types/card";

export const createCardSchema = Joi.object<CreateCardRequestBody>({
  employeeId: Joi.number().integer().required(),
  type: Joi.string()
    .valid("groceries", "restaurants", "health", "transport", "education")
    .required(),
});

export const activateCardSchema = Joi.object<ActivateCardRequestBody>({
  password: Joi.string()
    .length(4)
    .pattern(/[0-9]{4}/)
    .required(),
  securityCode: Joi.string()
    .length(3)
    .pattern(/[0-9]{3}/)
    .required(),
});
