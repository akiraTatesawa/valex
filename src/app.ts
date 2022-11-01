import dotenv from "dotenv";
import express, { Express } from "express";
import "express-async-errors";
import cors from "cors";
import { handleError } from "./middlewares";
import { serverRouter } from "./routes";
import { connectDb, disconnectDB } from "./config/prisma";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use(serverRouter);
app.use(handleError);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}
