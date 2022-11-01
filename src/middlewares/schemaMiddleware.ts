import { NextFunction, Request, Response } from "express";
import { createCardSchema, apiKeySchema, paramsIdSchema } from "../schemas";

import { CustomError } from "../errors";
import { activateCardSchema } from "../schemas/cardSchemas";

const BodySchemas = {
  createCardSchema,
  activateCardSchema,
};

type BodyValidator = keyof typeof BodySchemas;

export function validateBody(validator: BodyValidator) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { error } = BodySchemas[validator].validate(req.body, {
      abortEarly: false,
      convert: false,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join("; ");
      throw new CustomError("error_unprocessable_entity", message);
    }

    return next();
  };
}

const HeaderSchemas = {
  "x-api-key": apiKeySchema,
};

type HeaderValidator = keyof typeof HeaderSchemas;

export function validateHeader(validator: HeaderValidator) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers[validator];

    const { error } = HeaderSchemas[validator].validate(header, {
      abortEarly: false,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join("; ");
      throw new CustomError("error_unprocessable_entity", message);
    }

    return next();
  };
}

const ParamsSchemas = {
  id: paramsIdSchema,
};

type ParamsValidator = keyof typeof ParamsSchemas;

export function validateParams(validator: ParamsValidator) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.params[validator];

    const { error } = ParamsSchemas[validator].validate(header, {
      abortEarly: false,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join("; ");
      throw new CustomError("error_unprocessable_entity", message);
    }

    return next();
  };
}
