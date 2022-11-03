import { Payment, Recharge } from "@prisma/client";
import { PaymentDTO, RechargeDTO } from "../../dtos";
import { PaymentWithBusiness } from "../../repositories/IPaymentRepository";

interface GetCardBalanceRequest {
  recharges: Recharge[] | RechargeDTO[];
  payments: Payment[] | PaymentDTO[] | PaymentWithBusiness[];
}

type Balance = number;

export interface GetCardBalanceService {
  execute(data: GetCardBalanceRequest): Balance;
}

export class GetCardBalanceServiceImpl implements GetCardBalanceService {
  public execute({ payments, recharges }: GetCardBalanceRequest): Balance {
    let paymentsTotal = 0;
    payments.forEach((payment) => {
      paymentsTotal += payment.amount;
    });

    let rechargesTotal = 0;
    recharges.forEach((recharge) => {
      rechargesTotal += recharge.amount;
    });

    return rechargesTotal - paymentsTotal;
  }
}
