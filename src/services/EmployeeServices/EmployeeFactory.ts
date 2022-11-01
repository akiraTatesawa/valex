import { Employee as PrismaEmployee } from "@prisma/client";
import { randNumber, randEmail, randFullName } from "@ngneat/falso";

type PartialEmployeeProps = Partial<PrismaEmployee>;

export class EmployeeFactory {
  public createEmployeeId(): number {
    return randNumber();
  }

  public createEmployee({
    ...props
  }: PartialEmployeeProps = {}): PrismaEmployee {
    return {
      id: randNumber(),
      companyId: randNumber(),
      cpf: randNumber({ length: 11 }).toString(),
      email: randEmail(),
      fullName: randFullName(),
      ...props,
    };
  }
}
