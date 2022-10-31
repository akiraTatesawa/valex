import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { handleError } from "./middlewares";
import { serverRouter } from "./routes";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use(serverRouter);
app.use(handleError);
