import { Router } from "express";
import { cardRouter } from "./cardRouter";
import { paymentRouter } from "./paymentRouter";

export const serverRouter = Router();

serverRouter.use("/cards", cardRouter);
serverRouter.use("/payments", paymentRouter);
