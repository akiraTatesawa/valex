import { Router } from "express";
import { validateBody } from "../middlewares/schemaMiddleware";
import { posPaymentControllerFactory } from "../controllers/PaymentControllers/index";

export const paymentRouter = Router();

paymentRouter.post("/pos", validateBody("createPOSPaymentSchema"), (req, res) =>
  posPaymentControllerFactory().handle(req, res)
);
