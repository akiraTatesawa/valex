import { Router } from "express";
import { cardRouter } from "./cardRouter";

export const serverRouter = Router();

serverRouter.use("/cards", cardRouter);
