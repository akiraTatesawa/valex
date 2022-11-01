import { Request, Response } from "express";

import { CreateCardService } from "../../services/CardServices/CreateCardService";
import { Controller } from "../Controller";
import { CreateCardRequestBody } from "../../types/card";

export class CreateCardController extends Controller<CreateCardService> {
  public async handle(req: Request, res: Response): Promise<void> {
    const { employeeId, type } = req.body as CreateCardRequestBody;
    const apikey = req.headers["x-api-key"] as string;

    const card = await this.service.execute({ apikey, employeeId, type });

    res.status(201).send(card);
  }
}
