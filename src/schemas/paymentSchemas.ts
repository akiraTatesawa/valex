import Joi from "joi";
import { POSPaymentRequestBody } from "../types/payments";

export const createPOSPaymentSchema = Joi.object<POSPaymentRequestBody>({
  cardId: Joi.number().integer().required(),
  password: Joi.string()
    .length(4)
    .pattern(/[0-9]{4}/)
    .required(),
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().min(1).required(),
});
