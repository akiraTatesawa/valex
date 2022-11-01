import { Router } from "express";
import { validateHeader, validateBody } from "../middlewares/schemaMiddleware";
import { createCardControllerFactory } from "../controllers/CardControllers/index";

export const cardRouter = Router();

cardRouter.post(
  "/",
  validateHeader("x-api-key"),
  validateBody("createCardSchema"),
  (req, res) => createCardControllerFactory().handle(req, res)
);
