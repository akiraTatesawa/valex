import Joi from "joi";
import { CreateCardRequestBody } from "../types/card";

export const createCardSchema = Joi.object<CreateCardRequestBody>({
  employeeId: Joi.number().integer().required(),
  type: Joi.string()
    .valid("groceries", "restaurants", "health", "transport", "education")
    .required(),
});
