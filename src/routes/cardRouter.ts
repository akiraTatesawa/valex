import { Router } from "express";
import {
  validateHeader,
  validateBody,
  validateParams,
} from "../middlewares/schemaMiddleware";
import {
  activateCardControllerFactory,
  createCardControllerFactory,
} from "../controllers/CardControllers";

export const cardRouter = Router();

cardRouter
  .post(
    "/",
    validateHeader("x-api-key"),
    validateBody("createCardSchema"),
    (req, res) => createCardControllerFactory().handle(req, res)
  )
  .patch(
    "/:id/activate",
    validateParams("id"),
    validateBody("activateCardSchema"),
    (req, res) => activateCardControllerFactory().handle(req, res)
  );
