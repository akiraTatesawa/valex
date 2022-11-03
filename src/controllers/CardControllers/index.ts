import { PrismaCardRepository } from "../../repositories/prisma/CardRepository";
import { PrismaCompanyRepository } from "../../repositories/prisma/CompanyRepository";
import { PrismaEmployeeRepository } from "../../repositories/prisma/EmployeeRepository";
import { GetEmployeeServiceImpl } from "../../services/EmployeeServices/GetEmployeeService";
import { GetCompanyServiceImpl } from "../../services/CompanyServices/GetCompanyService";
import { CreateCardServiceImpl } from "../../services/CardServices/CreateCardService";
import { CreateCardController } from "./CreateCardController";
import { ActivateCardController } from "./ActivateCardController";
import { CardValidatorImpl } from "../../services/CardServices/CardValidator";
import { ActivateCardServiceImpl } from "../../services/CardServices/ActivateCardService";
import { BlockCardController } from "./BlockCardController";
import { BlockCardServiceImpl } from "../../services/CardServices/BlockCardService";
import { UnblockCardController } from "./UnblockCardController";
import { UnblockCardServiceImpl } from "../../services/CardServices/UnblockCardService";
import { GetCardStatementController } from "./GetCardStatementController";
import { PrismaRechargeRepository } from "../../repositories/prisma/RechargeRepository";
import { PrismaPaymentRepository } from "../../repositories/prisma/PaymentRepository";
import { GetAllRechargesServiceImpl } from "../../services/RechargeServices/GetAllRechargesService";
import { GetAllPaymentsServiceImpl } from "../../services/PaymentServices/GetAllPaymentsService";
import { GetCardStatementServiceImpl } from "../../services/CardServices/GetCardStatementService";
import { GetCardBalanceServiceImpl } from "../../services/CardServices/GetCardBalanceService";

export function createCardControllerFactory(): CreateCardController {
  const cardRepository = new PrismaCardRepository();

  const employeeRepository = new PrismaEmployeeRepository();
  const getEmployeeService = new GetEmployeeServiceImpl(employeeRepository);

  const companyRepository = new PrismaCompanyRepository();
  const getCompanyService = new GetCompanyServiceImpl(companyRepository);

  const createCardService = new CreateCardServiceImpl(
    cardRepository,
    getCompanyService,
    getEmployeeService
  );

  return new CreateCardController(createCardService);
}

export function activateCardControllerFactory(): ActivateCardController {
  const cardRepository = new PrismaCardRepository();

  const cardValidator = new CardValidatorImpl(cardRepository);
  const activateCardService = new ActivateCardServiceImpl(
    cardRepository,
    cardValidator
  );

  return new ActivateCardController(activateCardService);
}

export function blockCardControllerFactory(): BlockCardController {
  const cardRepository = new PrismaCardRepository();

  const cardValidator = new CardValidatorImpl(cardRepository);
  const blockCardService = new BlockCardServiceImpl(
    cardRepository,
    cardValidator
  );

  return new BlockCardController(blockCardService);
}

export function unblockCardControllerFactory(): UnblockCardController {
  const cardRepository = new PrismaCardRepository();
  const cardValidator = new CardValidatorImpl(cardRepository);
  const unblockCardService = new UnblockCardServiceImpl(
    cardValidator,
    cardRepository
  );

  return new UnblockCardController(unblockCardService);
}

export function getCardStatementControllerFactory(): GetCardStatementController {
  const cardRepository = new PrismaCardRepository();
  const rechargeRepository = new PrismaRechargeRepository();
  const paymentRepository = new PrismaPaymentRepository();

  const cardValidator = new CardValidatorImpl(cardRepository);
  const getRechargesService = new GetAllRechargesServiceImpl(
    rechargeRepository
  );
  const getPaymentsService = new GetAllPaymentsServiceImpl(paymentRepository);
  const getBalanceService = new GetCardBalanceServiceImpl();

  const service = new GetCardStatementServiceImpl(
    cardValidator,
    getBalanceService,
    getPaymentsService,
    getRechargesService
  );

  return new GetCardStatementController(service);
}
