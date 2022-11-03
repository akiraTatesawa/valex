import { Recharge } from "@prisma/client";
import { prisma } from "../../config/prisma";
import {
  CreateRechargeData,
  IRechargeRepository,
} from "../IRechargeRepository";

export class PrismaRechargeRepository implements IRechargeRepository {
  async create(data: CreateRechargeData): Promise<Recharge> {
    return prisma.recharge.create({
      data,
    });
  }

  async findByCardId(cardId: number): Promise<Recharge[]> {
    return prisma.recharge.findMany({
      where: {
        cardId,
      },
    });
  }
}
