import { randCompanyName } from "@ngneat/falso";
import { BusinessType } from "../types/business";
import { Business } from "./Business";

describe("Business Entity", () => {
  it("Should be able to create a Business Entity", () => {
    const name = randCompanyName();
    const type: BusinessType = "education";

    const business = Business.create({
      name,
      type,
    });

    expect(business).toBeInstanceOf(Business);
    expect(business.props.name).toEqual(name);
    expect(business.props.type).toEqual(type);
  });

  it("Should throw an error and not be able to create a Business Entity if name is an empty string", () => {
    const name = "";
    const type: BusinessType = "education";

    expect(() => {
      Business.create({
        name,
        type,
      });
    }).toThrow();
  });
});
