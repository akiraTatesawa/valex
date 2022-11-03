import { randNumber } from "@ngneat/falso";
import {
  IPaymentRepository,
  PaymentWithBusiness,
} from "../../repositories/IPaymentRepository";
import { MockPaymentRepository } from "../../repositories/mocks/MockPaymentRepository";
import { GetAllPaymentsServiceImpl } from "./GetAllPaymentsService";
import { PaymentFactory } from "./PaymentFactory";
import { PaymentMapper } from "../../mappers";

describe("Get All Payments Service", () => {
  const paymentRepository: IPaymentRepository = new MockPaymentRepository();
  const service = new GetAllPaymentsServiceImpl(paymentRepository);

  it("Should be able to get all the payments", async () => {
    const cardId = randNumber();
    const paymentsWithBusiness = [
      new PaymentFactory().generatePaymentWithBusiness({ cardId }),
    ];
    const paymentsDTO = paymentsWithBusiness.map((payment) =>
      new PaymentMapper().toDTO(payment)
    );

    jest
      .spyOn(paymentRepository, "findByCardId")
      .mockResolvedValueOnce(paymentsWithBusiness);

    await expect(service.execute({ cardId })).resolves.toEqual(paymentsDTO);
    expect(paymentRepository.findByCardId).toHaveBeenCalledWith(cardId);
  });

  it("Should return an empty array when there are no payments", async () => {
    const cardId = randNumber();
    const paymentsWithBusiness: PaymentWithBusiness[] = [];

    jest
      .spyOn(paymentRepository, "findByCardId")
      .mockResolvedValueOnce(paymentsWithBusiness);

    await expect(service.execute({ cardId })).resolves.toEqual([]);
    expect(paymentRepository.findByCardId).toHaveBeenCalledWith(cardId);
  });
});
