import { Request, Response } from "express";

import { BlockCardService } from "../../services/CardServices/BlockCardService";
import { Controller } from "../Controller";
import { BlockUnblockCardRequestBody } from "../../types/card";

export class BlockCardController extends Controller<BlockCardService> {
  public async handle(req: Request, res: Response): Promise<void> {
    const { password } = req.body as BlockUnblockCardRequestBody;
    const { id } = req.params as { id: string };

    await this.service.execute({ id: parseInt(id, 10), password });

    res.status(200).send();
  }
}
