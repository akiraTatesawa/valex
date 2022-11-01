import { randCompanyName } from "@ngneat/falso";
import { Company } from "./Company";

describe("Company Entity", () => {
  it("Should be able to create a Company Entity", () => {
    const name = randCompanyName();

    const company = Company.create({ name });

    expect(company).toBeInstanceOf(Company);
    expect(company.props.name).toEqual(name);
    expect(company.props).toHaveProperty("apikey");
  });

  it("Should throw an error and not be able to create a Company Entity if name is an empty string", () => {
    const name = "";

    expect(() => {
      Company.create({
        name,
      });
    }).toThrow();
  });
});
