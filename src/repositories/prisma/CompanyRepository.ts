import { Company as PrismaCompany } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ICompanyRepository } from "../ICompanyRepository";

export class PrismaCompanyRepository implements ICompanyRepository {
  public async findByApiKey(apiKey: string): Promise<PrismaCompany | null> {
    const company = await prisma.company.findUnique({
      where: {
        apikey: apiKey,
      },
    });

    return company;
  }
}
