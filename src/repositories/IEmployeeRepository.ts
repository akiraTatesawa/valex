import { Employee as PrismaEmployee } from "@prisma/client";

export interface IEmployeeRepository {
  findById(id: number): Promise<PrismaEmployee | null>;
}
