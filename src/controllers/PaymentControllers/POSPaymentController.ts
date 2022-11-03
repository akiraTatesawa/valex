import { Request, Response } from "express";

import { CreatePOSPaymentService } from "../../services/PaymentServices/CreatePOSPaymentService";
import { POSPaymentRequestBody } from "../../types/payments";
import { Controller } from "../Controller";

export class POSPaymentController extends Controller<CreatePOSPaymentService> {
  public async handle(req: Request, res: Response): Promise<void> {
    const { amount, businessId, cardId, password } =
      req.body as POSPaymentRequestBody;

    const payment = await this.service.execute({
      amount,
      businessId,
      cardId,
      password,
    });

    res.status(201).send(payment);
  }
}
