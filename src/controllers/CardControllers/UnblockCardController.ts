import { Request, Response } from "express";
import httpStatus from "http-status";

import { UnblockCardService } from "../../services/CardServices/UnblockCardService";
import { BlockUnblockCardRequestBody } from "../../types/card";
import { Controller } from "../Controller";

export class UnblockCardController extends Controller<UnblockCardService> {
  public async handle(req: Request, res: Response): Promise<void> {
    const { password } = req.body as BlockUnblockCardRequestBody;
    const { id } = req.params as { id: string };

    await this.service.execute({
      password,
      id: parseInt(id, 10),
    });

    res.status(httpStatus.OK).send();
  }
}
