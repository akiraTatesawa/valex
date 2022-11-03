import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { MockPaymentRepository } from "../../repositories/mocks/MockPaymentRepository";
import { CreatePOSPaymentServiceImpl } from "./CreatePOSPaymentService";
import { CardValidator } from "../CardServices/CardValidator";
import { MockCardValidator } from "../CardServices/mocks/MockCardValidator";
import { GetBusinessByIdService } from "../BusinessService/GetBusinessByIdService";
import { GetAllRechargesService } from "../RechargeServices/GetAllRechargesService";
import { GetCardBalanceService } from "../CardServices/GetCardBalanceService";
import { CardFactory } from "../CardServices/CardFactory";
import { BusinessFactory } from "../BusinessService/BusinessFactory";
import { RechargeFactory } from "../RechargeServices/RechargeFactory";
import { RechargeMapper, PaymentMapper } from "../../mappers";
import { PaymentFactory } from "./PaymentFactory";
import { CustomError } from "../../errors";

describe("Create POS Payment Service", () => {
  const paymentRepository: IPaymentRepository = new MockPaymentRepository();

  const cardValidator: CardValidator = new MockCardValidator();
  const getBusiness: GetBusinessByIdService = { execute: jest.fn() };
  const getRecharges: GetAllRechargesService = { execute: jest.fn() };
  const getCardBalance: GetCardBalanceService = { execute: jest.fn() };

  const service = new CreatePOSPaymentServiceImpl(
    paymentRepository,
    cardValidator,
    getBusiness,
    getRecharges,
    getCardBalance
  );

  it("Should be able to create a POS payment", async () => {
    const { card } = new CardFactory().createActiveCard();
    const business = new BusinessFactory().generateBusiness({
      type: card.type,
    });
    const recharge = new RechargeFactory().generate({
      cardId: card.id,
      amount: 1000,
    });
    const payment = new PaymentFactory().generatePaymentWithBusiness({
      amount: 900,
      business,
      cardId: card.id,
    });
    const paymentDTO = new PaymentMapper().toDTO(payment);

    jest.spyOn(cardValidator, "validateCardOrFail").mockResolvedValueOnce(card);
    jest.spyOn(getBusiness, "execute").mockResolvedValueOnce(business);
    jest.spyOn(paymentRepository, "findByCardId").mockResolvedValueOnce([]);
    jest
      .spyOn(getRecharges, "execute")
      .mockResolvedValueOnce([new RechargeMapper().toDTO(recharge)]);
    jest.spyOn(getCardBalance, "execute").mockReturnValueOnce(recharge.amount);
    jest.spyOn(paymentRepository, "create").mockResolvedValueOnce(payment);

    await expect(
      service.execute({
        amount: 900,
        businessId: business.id,
        cardId: card.id,
        password: "1234",
      })
    ).resolves.toEqual(paymentDTO);
    expect(paymentRepository.create).toHaveBeenCalled();
  });

  it("Should throw error if business type and card type are not the same", async () => {
    const { card } = new CardFactory().createActiveCard();
    const business = new BusinessFactory().generateBusiness({
      type: "health",
    });

    jest.spyOn(cardValidator, "validateCardOrFail").mockResolvedValueOnce(card);
    jest.spyOn(getBusiness, "execute").mockResolvedValueOnce(business);

    await expect(
      service.execute({
        amount: 10,
        businessId: business.id,
        cardId: card.id,
        password: "1234",
      })
    ).rejects.toEqual(
      new CustomError(
        "error_unprocessable_entity",
        "Business type and card type must be the same"
      )
    );
    expect(paymentRepository.create).not.toHaveBeenCalled();
  });

  it("Should throw error if card has insufficient balance", async () => {
    const { card } = new CardFactory().createActiveCard();
    const business = new BusinessFactory().generateBusiness({
      type: card.type,
    });
    const recharge = new RechargeFactory().generate({
      cardId: card.id,
      amount: 1000,
    });
    jest.spyOn(cardValidator, "validateCardOrFail").mockResolvedValueOnce(card);
    jest.spyOn(getBusiness, "execute").mockResolvedValueOnce(business);
    jest.spyOn(paymentRepository, "findByCardId").mockResolvedValueOnce([]);
    jest
      .spyOn(getRecharges, "execute")
      .mockResolvedValueOnce([new RechargeMapper().toDTO(recharge)]);
    jest.spyOn(getCardBalance, "execute").mockReturnValueOnce(recharge.amount);

    await expect(
      service.execute({
        amount: 9000,
        businessId: business.id,
        cardId: card.id,
        password: "1234",
      })
    ).rejects.toEqual(
      new CustomError("error_unprocessable_entity", "Insufficient balance")
    );
    expect(paymentRepository.create).not.toHaveBeenCalled();
  });
});
