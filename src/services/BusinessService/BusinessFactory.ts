import { Business } from "@prisma/client";
import { randNumber, randCompanyName } from "@ngneat/falso";

type PartialBusiness = Partial<Business>;

export class BusinessFactory {
  public generateBusiness({ ...props }: PartialBusiness = {}): Business {
    return {
      id: randNumber(),
      name: randCompanyName(),
      type: "education",
      ...props,
    };
  }
}
