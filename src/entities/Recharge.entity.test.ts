import { randNumber } from "@ngneat/falso";
import { Recharge } from "./Recharge";

describe("Recharge Entity", () => {
  it("Should be able to create a Recharge Entity", () => {
    const cardId = randNumber();
    const amount = randNumber({ min: 1 });

    const recharge = Recharge.create({
      amount,
      cardId,
    });

    expect(recharge).toBeInstanceOf(Recharge);
    expect(recharge.props.amount).toEqual(amount);
    expect(recharge.props.cardId).toEqual(cardId);
    expect(recharge.props).toHaveProperty("timestamp");
  });

  it("Should not be able to create a Recharge Entity if amount is less than zero", () => {
    const cardId = randNumber();
    const amount = randNumber({ max: 0 });

    expect(() => {
      Recharge.create({
        amount,
        cardId,
      });
    }).toThrow("Amount must be grater than zero");
  });
});
