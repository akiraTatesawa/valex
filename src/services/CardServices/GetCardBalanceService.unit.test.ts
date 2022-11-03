import { Payment } from "@prisma/client";
import { RechargeDTO } from "../../dtos";
import { GetCardBalanceServiceImpl } from "./GetCardBalanceService";
import { RechargeFactory } from "../RechargeServices/RechargeFactory";
import { PaymentFactory } from "../PaymentServices/PaymentFactory";
import { RechargeMapper } from "../../mappers/RechargeMapper";

describe("Get Card Balance Service", () => {
  const service = new GetCardBalanceServiceImpl();

  const rechargeFactory = new RechargeFactory();
  const paymentFactory = new PaymentFactory();

  it("Should return zero if payments and recharges are empty arrays", () => {
    const payments: Payment[] = [];
    const recharges: RechargeDTO[] = [];

    expect(service.execute({ payments, recharges })).toEqual(0);
  });

  it("Should return the balance", () => {
    const payment = paymentFactory.generatePayment({ amount: 1 });
    const recharge = new RechargeMapper().toDTO(
      rechargeFactory.generate({ amount: 1 })
    );

    const payments: Payment[] = [payment, payment];
    const recharges: RechargeDTO[] = [recharge, recharge];

    expect(service.execute({ payments, recharges })).toEqual(0);
  });

  it("Should return the balance when payments is an empty array", () => {
    const recharge = new RechargeMapper().toDTO(
      rechargeFactory.generate({ amount: 1 })
    );

    const payments: Payment[] = [];
    const recharges: RechargeDTO[] = [recharge, recharge];

    expect(service.execute({ payments, recharges })).toEqual(2);
  });
});
