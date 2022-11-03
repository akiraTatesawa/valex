import Joi from "joi";
import { CreateRechargeRequestBody } from "../types/recharges";

export const createRechargeSchema = Joi.object<CreateRechargeRequestBody>({
  amount: Joi.number().integer().min(1).required(),
});
