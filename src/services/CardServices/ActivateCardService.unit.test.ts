import { MockCardRepository } from "../../repositories/mocks/MockCardRepository";
import { ActivateCardServiceImpl } from "./ActivateCardService";
import { CardFactory } from "./CardFactory";
import { ICardRepository } from "../../repositories/ICardRepository";
import { CardValidator } from "./CardValidator";

describe("Activate Card Service", () => {
  const repository: ICardRepository = new MockCardRepository();

  const cardValidator: CardValidator = {
    ensureCardIsNotActive: jest.fn(),
    validateCardOrFail: jest.fn(),
    validateExpirationDateOrFail: jest.fn(),
    validateSecurityCodeOrFail: jest.fn(),
  };

  const service = new ActivateCardServiceImpl(repository, cardValidator);

  it("Should be able to activate card without throwing", async () => {
    const { card: mockCard, CVV } = new CardFactory().createCard();
    const password = "fake_pass";
    const { id } = mockCard;

    jest
      .spyOn(cardValidator, "validateCardOrFail")
      .mockResolvedValueOnce(mockCard);

    await expect(
      service.execute({ id, password, securityCode: CVV })
    ).resolves.not.toThrow();

    expect(cardValidator.validateCardOrFail).toHaveBeenCalledWith(id);
    expect(cardValidator.validateExpirationDateOrFail).toHaveBeenCalledWith(
      mockCard
    );
    expect(cardValidator.ensureCardIsNotActive).toHaveBeenCalledWith(mockCard);
    expect(cardValidator.validateSecurityCodeOrFail).toHaveBeenCalledWith(
      mockCard,
      CVV
    );
    expect(repository.activate).toHaveBeenCalled();
  });
});
