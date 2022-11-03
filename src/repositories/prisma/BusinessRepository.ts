import { Business } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { IBusinessRepository } from "../IBusinessRepository";

export class PrismaBusinessRepository implements IBusinessRepository {
  public async findById(id: number): Promise<Business | null> {
    return prisma.business.findUnique({
      where: {
        id,
      },
    });
  }
}
