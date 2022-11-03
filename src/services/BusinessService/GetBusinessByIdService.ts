import { Business } from "@prisma/client";
import { ServiceExecute } from "../../types/services";
import { IBusinessRepository } from "../../repositories/IBusinessRepository";
import { CustomError } from "../../errors";

interface GetBusinessByIdRequest {
  id: number;
}

export interface GetBusinessByIdService
  extends ServiceExecute<GetBusinessByIdRequest, Business> {}

export class GetBusinessByIdServiceImpl implements GetBusinessByIdService {
  private businessRepository: IBusinessRepository;

  constructor(businessRepository: IBusinessRepository) {
    this.businessRepository = businessRepository;
  }

  public async execute({ id }: GetBusinessByIdRequest): Promise<Business> {
    const business = await this.businessRepository.findById(id);

    if (!business) {
      throw new CustomError("error_not_found", "Business not found");
    }

    return business;
  }
}
