import { Company as PrismaCompany } from "@prisma/client";
import { randUuid, randNumber, randCompanyName } from "@ngneat/falso";

type PartialCompanyProps = Partial<PrismaCompany>;

export class CompanyFactory {
  public createApiKey(): string {
    return randUuid();
  }

  public createCompany({ ...props }: PartialCompanyProps = {}): PrismaCompany {
    return {
      id: randNumber(),
      apikey: randUuid(),
      name: randCompanyName(),
      ...props,
    };
  }
}
