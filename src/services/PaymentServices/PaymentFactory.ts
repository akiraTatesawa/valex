import { Payment } from "@prisma/client";
import { randNumber } from "@ngneat/falso";

type PartialPayment = Partial<Payment>;

export class PaymentFactory {
  public generatePayment({ ...props }: PartialPayment = {}): Payment {
    return {
      id: randNumber(),
      amount: randNumber({ min: 1 }),
      businessId: randNumber(),
      cardId: randNumber(),
      timestamp: new Date(),
      ...props,
    };
  }
}
