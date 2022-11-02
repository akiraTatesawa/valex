import { Card as PrismaCard } from "@prisma/client";
import { BusinessType } from "../types/business";

export type CreateCardData = Omit<PrismaCard, "id">;

export interface ICardRepository {
  create(card: CreateCardData): Promise<PrismaCard>;
  activate(id: number, password: string): Promise<void>;
  block(id: number): Promise<void>;
  unblock(id: number): Promise<void>;
  findByTypeAndEmployeeId(
    type: BusinessType,
    employeeId: number
  ): Promise<PrismaCard | null>;
  findById(id: number): Promise<PrismaCard | null>;
}
