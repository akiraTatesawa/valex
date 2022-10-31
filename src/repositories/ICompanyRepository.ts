import { Company as PrismaCompany } from "@prisma/client";

export interface ICompanyRepository {
  findByApiKey(apiKey: string): Promise<PrismaCompany | null>;
}
