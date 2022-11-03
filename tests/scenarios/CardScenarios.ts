import Cryptr from "cryptr";
import { randNumber } from "@ngneat/falso";
import bcrypt from "bcrypt";
import { prisma } from "../../src/config/prisma";
import { CardFactory } from "../../src/services/CardServices/CardFactory";
import { CompanyFactory } from "../../src/services/CompanyServices/CompanyFactory";
import { EmployeeFactory } from "../../src/services/EmployeeServices/EmployeeFactory";
import { CreateRechargeRequestBody } from "../../src/types/recharges";
import {
  CreateCardRequestBody,
  ActivateCardRequestBody,
} from "../../src/types/card";

export class CardScenarios {
  private cardFactory: CardFactory;

  private companyFactory: CompanyFactory;

  private employeeFactory: EmployeeFactory;

  private cryptr: Cryptr;

  constructor(
    cardFactory: CardFactory,
    companyFactory: CompanyFactory,
    employeeFactory: EmployeeFactory
  ) {
    this.cardFactory = cardFactory;
    this.companyFactory = companyFactory;
    this.employeeFactory = employeeFactory;
    this.cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);
  }

  public async companyEmployeeScenario() {
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

    const headers = {
      "x-api-key": prismaCompany.apikey,
    };

    return {
      prismaCompany,
      prismaEmployee,
      headers,
    };
  }

  public async createCardScenario() {
    const { headers, prismaCompany, prismaEmployee } =
      await this.companyEmployeeScenario();

    const createCardData: CreateCardRequestBody = {
      employeeId: prismaEmployee.id,
      type: "education",
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

    const { card: cardEntity } = this.cardFactory.createCard({
      cardholderName: prismaEmployee.fullName,
      employeeId: prismaEmployee.id,
      type: createCardData.type,
    });

    const prismaCard = await prisma.card.create({
      data: cardEntity,
    });

    return { prismaCard, createCardData, headers };
  }

  public async activateCardScenario() {
    const { prismaCard, headers } = await this.conflictCardScenario();

    const { securityCode: encryptedCVV } = prismaCard;
    const securityCode = this.cryptr.decrypt(encryptedCVV);

    const activateCardData: ActivateCardRequestBody = {
      password: randNumber({ min: 1000, max: 9999 }).toString(),
      securityCode,
    };

    return { activateCardData, id: prismaCard.id, prismaCard, headers };
  }

  public async blockCardScenario({ isBlocked }: { isBlocked: boolean }) {
    const { id, activateCardData, headers } = await this.activateCardScenario();

    const encryptedPass = bcrypt.hashSync(activateCardData.password, 10);

    await prisma.card.update({
      where: {
        id,
      },
      data: {
        password: encryptedPass,
        isBlocked,
      },
    });

    return { id, password: activateCardData.password, headers };
  }

  public async rechargeCardScenario({ amount }: { amount: number }) {
    const { headers, id } = await this.blockCardScenario({ isBlocked: false });

    const requestData: CreateRechargeRequestBody = {
      amount,
    };

    return { headers, requestData, id };
  }
}
