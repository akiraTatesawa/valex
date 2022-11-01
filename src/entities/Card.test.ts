import { randNumber, randFullName } from "@ngneat/falso";
import { BusinessType } from "../types/business";
import { Card } from "./Card";

describe("Card Entity", () => {
  it("Should be able to create a Card Entity", () => {
    const cardholderName = randFullName();
    const employeeId = randNumber();
    const type: BusinessType = "education";

    const card = Card.create({
      cardholderName,
      employeeId,
      type,
    });

    expect(card).toBeInstanceOf(Card);
    expect(card.props).toHaveProperty("number");
    expect(card.props.password).toEqual(null);
    expect(card.props.originalCardId).toEqual(null);
    expect(card.props.employeeId).toEqual(employeeId);
    expect(card.props.type).toEqual(type);
  });

  it("Should not be able to create a Card Entity if cardholderName is an empty string", () => {
    const cardholderName = "";
    const employeeId = randNumber();
    const type: BusinessType = "education";
    expect(() => {
      Card.create({
        cardholderName,
        employeeId,
        type,
      });
    }).toThrow();
  });
});
