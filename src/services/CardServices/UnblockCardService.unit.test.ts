import { ICardRepository } from "../../repositories/ICardRepository";
import { MockCardRepository } from "../../repositories/mocks/MockCardRepository";
import { CardValidator } from "./CardValidator";
import { MockCardValidator } from "./mocks/MockCardValidator";
import { CardFactory } from "./CardFactory";
import { UnblockCardServiceImpl } from "./UnblockCardService";

describe("Unblock Card Service", () => {
  const repository: ICardRepository = new MockCardRepository();

  const cardValidator: CardValidator = new MockCardValidator();

  const service = new UnblockCardServiceImpl(cardValidator, repository);

  it("Should be able to unblock a card", async () => {
    const { card, password } = new CardFactory().createActiveCard({
      isBlocked: true,
    });

    jest.spyOn(cardValidator, "validateCardOrFail").mockResolvedValueOnce(card);

    await expect(
      service.execute({ id: card.id, password })
    ).resolves.not.toThrow();

    expect(repository.unblock).toHaveBeenCalledWith(card.id);
  });
});
