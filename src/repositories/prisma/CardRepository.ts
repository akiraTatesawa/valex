import { Card as PrismaCard } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { BusinessType } from "../../types/business";
import { CreateCardData, ICardRepository } from "../ICardRepository";

export class PrismaCardRepository implements ICardRepository {
  public async create(card: CreateCardData): Promise<PrismaCard> {
    return prisma.card.create({
      data: card,
    });
  }

  public async findByTypeAndEmployeeId(
    type: BusinessType,
    employeeId: number
  ): Promise<PrismaCard | null> {
    const card = await prisma.card.findUnique({
      where: {
        employee_type: {
          employeeId,
          type,
        },
      },
    });

    return card;
  }
}
