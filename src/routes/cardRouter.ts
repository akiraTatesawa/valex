import { Router } from "express";

import { createRechargeControllerFactory } from "../controllers/RechargeControllers";
import {
  blockCardControllerFactory,
  activateCardControllerFactory,
  createCardControllerFactory,
  unblockCardControllerFactory,
} from "../controllers/CardControllers";
import { validateHeader, validateBody, validateParams } from "../middlewares";

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
  )
  .patch(
    "/:id/unblock",
    validateParams("id"),
    validateBody("blockUnblockCardSchema"),
    (req, res) => unblockCardControllerFactory().handle(req, res)
  )
  .post(
    "/:id/recharge",
    validateParams("id"),
    validateHeader("x-api-key"),
    validateBody("createRechargeSchema"),
    (req, res) => createRechargeControllerFactory().handle(req, res)
  );
