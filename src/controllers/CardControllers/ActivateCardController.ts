import { Request, Response } from "express";

import { ActivateCardService } from "../../services/CardServices/ActivateCardService";
import { Controller } from "../Controller";
import { ActivateCardRequestBody } from "../../types/card";

export class ActivateCardController extends Controller<ActivateCardService> {
  public async handle(req: Request, res: Response): Promise<void> {
    const { password, securityCode } = req.body as ActivateCardRequestBody;
    const { id } = req.params as { id: string };

    await this.service.execute({
      id: parseInt(id, 10),
      password,
      securityCode,
    });

    res.status(200).send();
  }
}
