import { Request, Response } from "express";

import { Controller } from "../Controller";
import { CreateRechargeRequestBody } from "../../types/recharges";
import { CreateRechargeService } from "../../services/RechargeServices/CreateRechargeService";

export class CreateRechargeController extends Controller<CreateRechargeService> {
  async handle(req: Request, res: Response): Promise<void> {
    const apikey = req.headers["x-api-key"] as string;
    const { id } = req.params as { id: string };
    const { amount } = req.body as CreateRechargeRequestBody;

    const recharge = await this.service.execute({
      apikey,
      amount,
      cardId: parseInt(id, 10),
    });

    res.status(201).send(recharge);
  }
}
