import { randNumber, randCreditCardCVV } from "@ngneat/falso";

import { ICardRepository } from "../../repositories/ICardRepository";
import { MockCardRepository } from "../../repositories/mocks/MockCardRepository";
import { CardFactory } from "./CardFactory";
import { CardValidatorImpl } from "./CardValidator";
import { CustomError } from "../../errors/index";

describe("Card Validator", () => {
  const repository: ICardRepository = new MockCardRepository();

  const cardValidator = new CardValidatorImpl(repository);
  describe("Validate Card By Id", () => {
    it("Should be able to validate card by id without throwing", async () => {
      const id = randNumber();
      const { card: mockCard } = new CardFactory().createCard({ id });

      jest.spyOn(repository, "findById").mockResolvedValueOnce(mockCard);

      await expect(cardValidator.validateCardOrFail(id)).resolves.toEqual(
        mockCard
      );

      expect(repository.findById).toHaveBeenCalledWith(id);
    });

    it("Should throw error if card does not exist", async () => {
      const id = randNumber();

      jest.spyOn(repository, "findById").mockResolvedValueOnce(null);

      await expect(cardValidator.validateCardOrFail(id)).rejects.toEqual(
        new CustomError("error_not_found", "Card not found")
      );

      expect(repository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe("Validate Expiration Date", () => {
    it("Should be able to validate expiration date without throwing", () => {
      const { card: mockCard } = new CardFactory().createCard();

      expect(() => {
        cardValidator.validateExpirationDateOrFail(mockCard);
      }).not.toThrow();
    });

    it("Should throw error if the card is expired", () => {
      const { card: mockCard } = new CardFactory().createCard({
        expirationDate: "01/21",
      });

      expect(() => {
        cardValidator.validateExpirationDateOrFail(mockCard);
      }).toThrow();
    });
  });

  describe("Ensure card is not active", () => {
    it("Should be able to validate without throwing", () => {
      const { card: mockCard } = new CardFactory().createCard();

      expect(() => {
        cardValidator.ensureCardIsNotActive(mockCard);
      }).not.toThrow();
    });

    it("Should throw error if the card is already active", () => {
      const { card: mockCard } = new CardFactory().createCard({
        password: "fake_pass",
      });

      expect(() => {
        cardValidator.ensureCardIsNotActive(mockCard);
      }).toThrow();
    });
  });

  describe("Ensure card is active", () => {
    it("Should be able to validade without throwing", () => {
      const { card: mockCard } = new CardFactory().createCard({
        password: "1234",
      });

      expect(() => {
        cardValidator.ensureCardIsActive(mockCard);
      }).not.toThrow();
    });

    it("Should throw error if card is not active", () => {
      const { card: mockCard } = new CardFactory().createCard();

      expect(() => {
        cardValidator.ensureCardIsActive(mockCard);
      }).toThrow();
    });
  });

  describe("Validate Security Code", () => {
    it("Should be able to validate the CVV without throwing", () => {
      const { card: mockCard, CVV } = new CardFactory().createCard();

      expect(() => {
        cardValidator.validateSecurityCodeOrFail(mockCard, CVV);
      }).not.toThrow();
    });

    it("Should throw error if the CVV is wrong", () => {
      const CVV = randCreditCardCVV();

      const { card: mockCard } = new CardFactory().createCard();

      expect(() => {
        cardValidator.validateSecurityCodeOrFail(mockCard, CVV);
      }).toThrow();
    });
  });

  describe("Validate Password", () => {
    it("Should be able to validate password without throwing", () => {
      const { card, password } = new CardFactory().createActiveCard();

      expect(() => {
        cardValidator.validatePasswordOrFail(card, password);
      }).not.toThrow();
    });

    it("Should throw error if password is incorrect", () => {
      const { card } = new CardFactory().createActiveCard();

      expect(() => {
        cardValidator.validatePasswordOrFail(card, "1111");
      }).toThrow();
    });
  });

  describe("Ensure card is not blocked", () => {
    it("Should be able to validate without throwing", () => {
      const { card: mockCard } = new CardFactory().createCard();

      expect(() => {
        cardValidator.ensureCardIsNotBlocked(mockCard);
      }).not.toThrow();
    });

    it("Should throw error if card is already blocked", () => {
      const { card: mockCard } = new CardFactory().createCard({
        isBlocked: true,
      });

      expect(() => {
        cardValidator.ensureCardIsNotBlocked(mockCard);
      }).toThrow();
    });
  });
});
