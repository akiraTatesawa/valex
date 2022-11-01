import Joi from "joi";

export const apiKeySchema = Joi.string().required().label("API_KEY");
