import { Employee } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { IEmployeeRepository } from "../IEmployeeRepository";

export class PrismaEmployeeRepository implements IEmployeeRepository {
  public async findById(id: number): Promise<Employee | null> {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    return employee;
  }
}
