import { randFullName, randNumber, randEmail } from "@ngneat/falso";
import { Employee } from "./Employee";

describe("Employee Entity", () => {
  it("Should be able to create an Employee Entity", () => {
    const fullName = randFullName();
    const cpf = randNumber({ length: 11 }).toString();
    const email = randEmail();
    const companyId = randNumber();

    const employee = Employee.create({
      companyId,
      cpf,
      email,
      fullName,
    });

    expect(employee).toBeInstanceOf(Employee);
    expect(employee.props.fullName).toEqual(fullName);
    expect(employee.props.email).toEqual(email);
    expect(employee.props.cpf).toEqual(cpf);
    expect(employee.props.companyId).toEqual(companyId);
  });

  it("Should not be able to create an Employee Entity if name is an empty string", () => {
    const fullName = "";
    const cpf = randNumber({ length: 11 }).toString();
    const email = randEmail();
    const companyId = randNumber();

    expect(() => {
      Employee.create({
        companyId,
        cpf,
        email,
        fullName,
      });
    }).toThrow();
  });

  it("Should not be able to create an Employee Entity if cpf is an empty string", () => {
    const fullName = randFullName();
    const cpf = "";
    const email = randEmail();
    const companyId = randNumber();

    expect(() => {
      Employee.create({
        companyId,
        cpf,
        email,
        fullName,
      });
    }).toThrow();
  });

  it("Should not be able to create an Employee Entity if email is an empty string", () => {
    const fullName = randFullName();
    const cpf = randNumber({ length: 11 }).toString();
    const email = "";
    const companyId = randNumber();

    expect(() => {
      Employee.create({
        companyId,
        cpf,
        email,
        fullName,
      });
    }).toThrow();
  });
});
