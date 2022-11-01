import { MockCardRepository } from "../../repositories/mocks/MockCardRepository";
import { BlockCardServiceImpl } from "./BlockCardService";
import { ICardRepository } from "../../repositories/ICardRepository";
import { CardValidator } from "./CardValidator";
import { CardFactory } from "./CardFactory";

describe("Block Card Service", () => {
  const repository: ICardRepository = new MockCardRepository();

  const cardValidator: CardValidator = {
    ensureCardIsNotActive: jest.fn(),
    validateCardOrFail: jest.fn(),
    validateExpirationDateOrFail: jest.fn(),
    validateSecurityCodeOrFail: jest.fn(),
    ensureCardIsActive: jest.fn(),
    ensureCardIsNotBlocked: jest.fn(),
    validatePasswordOrFail: jest.fn(),
  };

  const service = new BlockCardServiceImpl(repository, cardValidator);

  it("Should be able to block a card", async () => {
    const { card, password } = new CardFactory().createActiveCard();

    jest.spyOn(cardValidator, "validateCardOrFail").mockResolvedValueOnce(card);

    await expect(
      service.execute({ id: card.id, password })
    ).resolves.not.toThrow();

    expect(repository.block).toHaveBeenCalledWith(card.id);
  });
});
