import { PrismaPaymentRepository } from "../../repositories/prisma/PaymentRepository";
import { PrismaCardRepository } from "../../repositories/prisma/CardRepository";
import { PrismaBusinessRepository } from "../../repositories/prisma/BusinessRepository";
import { PrismaRechargeRepository } from "../../repositories/prisma/RechargeRepository";
import { CardValidatorImpl } from "../../services/CardServices/CardValidator";
import { CreatePOSPaymentServiceImpl } from "../../services/PaymentServices/CreatePOSPaymentService";
import { GetBusinessByIdServiceImpl } from "../../services/BusinessService/GetBusinessByIdService";
import { GetAllRechargesServiceImpl } from "../../services/RechargeServices/GetAllRechargesService";
import { GetCardBalanceServiceImpl } from "../../services/CardServices/GetCardBalanceService";
import { POSPaymentController } from "./POSPaymentController";

export function posPaymentControllerFactory() {
  const paymentRepository = new PrismaPaymentRepository();
  const cardRepository = new PrismaCardRepository();
  const businessRepository = new PrismaBusinessRepository();
  const rechargeRepository = new PrismaRechargeRepository();

  const cardValidator = new CardValidatorImpl(cardRepository);
  const getBusinessService = new GetBusinessByIdServiceImpl(businessRepository);
  const getRechargesService = new GetAllRechargesServiceImpl(
    rechargeRepository
  );
  const getCardBalance = new GetCardBalanceServiceImpl();

  const createPOSPaymentService = new CreatePOSPaymentServiceImpl(
    paymentRepository,
    cardValidator,
    getBusinessService,
    getRechargesService,
    getCardBalance
  );

  return new POSPaymentController(createPOSPaymentService);
}
