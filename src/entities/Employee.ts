import { Entity } from "./Entity";

interface EmployeeProps {
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export class Employee extends Entity<EmployeeProps> {
  private constructor(props: EmployeeProps) {
    super(props);
  }

  public static create({ fullName, cpf, email, companyId }: EmployeeProps) {
    if (fullName.length === 0) {
      throw Error("Employee name cannot be empty");
    }
    if (cpf.length === 0) {
      throw Error("Employee cpf cannot be empty");
    }
    if (email.length === 0) {
      throw Error("Employee email cannot be empty");
    }

    return new Employee({
      fullName,
      cpf,
      email,
      companyId,
    });
  }
}
