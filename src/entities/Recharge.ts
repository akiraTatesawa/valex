import { Entity } from "./Entity";
import { CustomError } from "../errors/index";

interface RechargeProps {
  cardId: number;
  amount: number;
  timestamp: Date;
}

type CreateRecharge = Omit<RechargeProps, "timestamp">;

export class Recharge extends Entity<RechargeProps> {
  private constructor(props: RechargeProps) {
    super(props);
  }

  public static create({ amount, cardId }: CreateRecharge) {
    if (amount <= 0) {
      throw new CustomError(
        "error_internal_server_error",
        "Amount must be grater than zero"
      );
    }

    return new Recharge({
      amount,
      cardId,
      timestamp: new Date(),
    });
  }
}
