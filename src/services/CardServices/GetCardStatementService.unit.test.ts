import { randNumber } from "@ngneat/falso";
import { CardValidator } from "./CardValidator";
import { MockCardValidator } from "./mocks/MockCardValidator";
import { GetAllRechargesService } from "../RechargeServices/GetAllRechargesService";
import { GetAllPaymentsService } from "../PaymentServices/GetAllPaymentsService";
import { GetCardBalanceService } from "./GetCardBalanceService";
import { GetCardStatementServiceImpl } from "./GetCardStatementService";
import { RechargeFactory } from "../RechargeServices/RechargeFactory";
import { PaymentFactory } from "../PaymentServices/PaymentFactory";
import { PaymentMapper, RechargeMapper } from "../../mappers";

describe("Get Card Statement Service", () => {
  const cardValidator: CardValidator = new MockCardValidator();
  const getRechargesService: GetAllRechargesService = { execute: jest.fn() };
  const getPaymentsService: GetAllPaymentsService = { execute: jest.fn() };
  const getBalanceService: GetCardBalanceService = { execute: jest.fn() };

  const service = new GetCardStatementServiceImpl(
    cardValidator,
    getBalanceService,
    getPaymentsService,
    getRechargesService
  );

  const rechargeFactory = new RechargeFactory();
  const paymentFactory = new PaymentFactory();

  const rechargeMapper = new RechargeMapper();
  const paymentMapper = new PaymentMapper();

  it("Should be able to get the statement", async () => {
    const cardId = randNumber();

    const paymentsDTO = [
      paymentMapper.toDTO(
        paymentFactory.generatePaymentWithBusiness({ amount: 100, cardId })
      ),
    ];
    const rechargesDTO = [
      rechargeMapper.toDTO(rechargeFactory.generate({ amount: 200, cardId })),
    ];

    jest
      .spyOn(getPaymentsService, "execute")
      .mockResolvedValueOnce(paymentsDTO);
    jest
      .spyOn(getRechargesService, "execute")
      .mockResolvedValueOnce(rechargesDTO);
    jest.spyOn(getBalanceService, "execute").mockReturnValueOnce(100);

    await expect(service.execute({ cardId })).resolves.toEqual({
      balance: 100,
      payments: paymentsDTO,
      recharges: rechargesDTO,
    });
  });
});
