import { PrismaRechargeRepository } from "../../repositories/prisma/RechargeRepository";
import { PrismaCardRepository } from "../../repositories/prisma/CardRepository";
import { PrismaCompanyRepository } from "../../repositories/prisma/CompanyRepository";
import { CardValidatorImpl } from "../../services/CardServices/CardValidator";
import { GetCompanyServiceImpl } from "../../services/CompanyServices/GetCompanyService";
import { CreateRechargeController } from "./CreateRechargeController";
import { CreateRechargeServiceImpl } from "../../services/RechargeServices/CreateRechargeService";

export function createRechargeControllerFactory(): CreateRechargeController {
  const rechargeRepository = new PrismaRechargeRepository();
  const cardRepository = new PrismaCardRepository();
  const companyRepository = new PrismaCompanyRepository();

  const cardValidator = new CardValidatorImpl(cardRepository);
  const companyValidator = new GetCompanyServiceImpl(companyRepository);

  const createRechargeService = new CreateRechargeServiceImpl(
    rechargeRepository,
    cardValidator,
    companyValidator
  );

  return new CreateRechargeController(createRechargeService);
}
