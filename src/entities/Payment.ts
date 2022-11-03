import { CustomError } from "../errors";
import { Entity } from "./Entity";

interface PaymentProps {
  cardId: number;
  businessId: number;
  amount: number;
  timestamp: Date;
}

type CreatePaymentProps = Omit<PaymentProps, "timestamp">;

export class Payment extends Entity<PaymentProps> {
  private constructor(props: PaymentProps) {
    super(props);
  }

  public static create({ amount, businessId, cardId }: CreatePaymentProps) {
    if (amount <= 0) {
      throw new CustomError(
        "error_internal_server_error",
        "Amount must be grater than zero"
      );
    }

    const payment = new Payment({
      amount,
      businessId,
      cardId,
      timestamp: new Date(),
    });

    return payment;
  }
}
