import { Card as PrismaCard } from "@prisma/client";
import { BusinessType } from "../types/business";

export type CreateCardData = Omit<PrismaCard, "id">;

export interface ICardRepository {
  create(card: CreateCardData): Promise<PrismaCard>;
  findByTypeAndEmployeeId(
    type: BusinessType,
    employeeId: number
  ): Promise<PrismaCard | null>;
}
