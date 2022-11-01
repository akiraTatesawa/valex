import { prisma } from "../../src/config/prisma";
import { CardFactory } from "../../src/services/CardServices/CardFactory";
import { CompanyFactory } from "../../src/services/CompanyServices/CompanyFactory";
import { EmployeeFactory } from "../../src/services/EmployeeServices/EmployeeFactory";
import { CreateCardRequestBody } from "../../src/types/card";

export class CardScenarios {
  private cardFactory: CardFactory;

  private companyFactory: CompanyFactory;

  private employeeFactory: EmployeeFactory;

  constructor(
    cardFactory: CardFactory,
    companyFactory: CompanyFactory,
    employeeFactory: EmployeeFactory
  ) {
    this.cardFactory = cardFactory;
    this.companyFactory = companyFactory;
    this.employeeFactory = employeeFactory;
  }

  public async createCardScenario() {
    const companyEntity = this.companyFactory.createCompany();

    const prismaCompany = await prisma.company.create({
      data: companyEntity,
    });

    const employeeEntity = this.employeeFactory.createEmployee({
      companyId: prismaCompany.id,
    });

    const prismaEmployee = await prisma.employee.create({
      data: employeeEntity,
    });

    const createCardData: CreateCardRequestBody = {
      employeeId: prismaEmployee.id,
      type: "education",
    };

    const headers = {
      "x-api-key": prismaCompany.apikey,
    };

    return {
      prismaCompany,
      prismaEmployee,
      createCardData,
      headers,
    };
  }

  public async conflictCardScenario() {
    const { prismaEmployee, createCardData, headers } =
      await this.createCardScenario();

    const cardEntity = this.cardFactory.createCard({
      cardholderName: prismaEmployee.fullName,
      employeeId: prismaEmployee.id,
      type: createCardData.type,
    });

    const prismaCard = await prisma.card.create({
      data: cardEntity,
    });

    return { prismaCard, createCardData, headers };
  }
}
