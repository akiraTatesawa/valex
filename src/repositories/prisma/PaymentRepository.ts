import { prisma } from "../../config/prisma";
import {
  CreatePaymentData,
  IPaymentRepository,
  PaymentWithBusiness,
} from "../IPaymentRepository";

export class PrismaPaymentRepository implements IPaymentRepository {
  public async create(data: CreatePaymentData): Promise<PaymentWithBusiness> {
    return prisma.payment.create({
      select: {
        id: true,
        amount: true,
        cardId: true,
        business: true,
        timestamp: true,
      },
      data,
    });
  }

  public async findByCardId(cardId: number): Promise<PaymentWithBusiness[]> {
    return prisma.payment.findMany({
      where: {
        cardId,
      },
      select: {
        id: true,
        amount: true,
        cardId: true,
        timestamp: true,
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }
}
