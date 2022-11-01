import { Company as PrismaCompany } from "@prisma/client";
import { CustomError } from "../../errors";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";
import { ServiceExecute } from "../../types/services";

interface GetCompanyRequest {
  apiKey: string;
}

type GetCompanyResponse = PrismaCompany;

export interface GetCompanyService
  extends ServiceExecute<GetCompanyRequest, GetCompanyResponse> {}

export class GetCompanyServiceImpl implements GetCompanyService {
  private repository: ICompanyRepository;

  constructor(repository: ICompanyRepository) {
    this.repository = repository;
  }

  public async execute({
    apiKey,
  }: GetCompanyRequest): Promise<GetCompanyResponse> {
    const company = await this.repository.findByApiKey(apiKey);

    if (!company) {
      throw new CustomError("error_not_found", "Company not found");
    }

    return company;
  }
}
