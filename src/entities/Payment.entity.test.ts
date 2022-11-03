import { randNumber } from "@ngneat/falso";
import { Payment } from "./Payment";

describe("Payment Entity", () => {
  it("Should be able to create a Payment Entity", () => {
    const cardId = randNumber();
    const businessId = randNumber();
    const amount = randNumber({ min: 1 });

    const payment = Payment.create({
      amount,
      cardId,
      businessId,
    });

    expect(payment).toBeInstanceOf(Payment);
    expect(payment.props.amount).toEqual(amount);
    expect(payment.props.cardId).toEqual(cardId);
    expect(payment.props).toHaveProperty("timestamp");
  });

  it("Should not be able to create a Payment Entity if amount is less than zero", () => {
    const cardId = randNumber();
    const businessId = randNumber();
    const amount = randNumber({ max: 0 });

    expect(() => {
      Payment.create({
        amount,
        cardId,
        businessId,
      });
    }).toThrow("Amount must be grater than zero");
  });
});
