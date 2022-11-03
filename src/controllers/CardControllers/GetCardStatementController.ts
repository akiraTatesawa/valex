import { Request, Response } from "express";

import { Controller } from "../Controller";
import { GetCardStatementService } from "../../services/CardServices/GetCardStatementService";

export class GetCardStatementController extends Controller<GetCardStatementService> {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id } = req.params as { id: string };

    const statement = await this.service.execute({ cardId: parseInt(id, 10) });

    res.status(200).send(statement);
  }
}
