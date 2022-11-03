import { Payment } from "@prisma/client";
import { randNumber } from "@ngneat/falso";
import { PaymentWithBusiness } from "../../repositories/IPaymentRepository";
import { BusinessFactory } from "../BusinessService/BusinessFactory";

type PartialPayment = Partial<Payment>;
type PartialPaymentWithBusiness = Partial<PaymentWithBusiness>;

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

  public generatePaymentWithBusiness({
    ...props
  }: PartialPaymentWithBusiness = {}): PaymentWithBusiness {
    const business = new BusinessFactory().generateBusiness();

    return {
      id: randNumber(),
      amount: randNumber({ min: 1 }),
      business,
      cardId: randNumber(),
      timestamp: new Date(),
      ...props,
    };
  }
}
