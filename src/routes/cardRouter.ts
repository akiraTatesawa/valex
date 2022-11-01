import { Router } from "express";
import {
  blockCardControllerFactory,
  activateCardControllerFactory,
  createCardControllerFactory,
} from "../controllers/CardControllers/index";
import {
  validateHeader,
  validateBody,
  validateParams,
} from "../middlewares/schemaMiddleware";

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
  )
  .patch(
    "/:id/block",
    validateParams("id"),
    validateBody("blockUnblockCardSchema"),
    (req, res) => blockCardControllerFactory().handle(req, res)
  );
