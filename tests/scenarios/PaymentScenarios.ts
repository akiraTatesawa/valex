import { randBrand, randCompanyName } from "@ngneat/falso";
import bcrypt from "bcrypt";
import { Business, Card } from "../../src/entities";
import { BusinessType } from "../../src/types/business";
import { prisma } from "../../src/config/prisma";
import { cardScenariosFactory } from "./index";

export class PaymentScenarios {
  public generateBusiness(type: BusinessType) {
    return Business.create({
      name: randBrand() + randCompanyName(),
      type,
    }).props;
  }

  public async createPayment(businessType: BusinessType = "education") {
    const { prismaEmployee } =
      await cardScenariosFactory().companyEmployeeScenario();

    const business = await prisma.business.create({
      data: this.generateBusiness(businessType),
    });

    const cardEntity = Card.create({
      cardholderName: prismaEmployee.fullName,
      employeeId: prismaEmployee.id,
      type: "education",
    });

    const password = "1234";

    const prismaCard = await prisma.card.create({
      data: { ...cardEntity.props, password: bcrypt.hashSync(password, 10) },
    });

    const recharge = await prisma.recharge.create({
      data: {
        amount: 1000,
        timestamp: new Date(),
        cardId: prismaCard.id,
      },
    });

    return { business, prismaCard, recharge, password };
  }
}
