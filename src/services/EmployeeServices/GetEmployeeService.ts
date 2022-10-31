import { Employee as PrismaEmployee } from "@prisma/client";
import { ServiceExecute } from "../../types/services";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { CustomError } from "../../errors";

interface GetEmployeeRequest {
  id: number;
}

type GetEmployeeResponse = PrismaEmployee;

export interface GetEmployeeService
  extends ServiceExecute<GetEmployeeRequest, GetEmployeeResponse> {}

export class GetEmployeeServiceImpl implements GetEmployeeService {
  private repository: IEmployeeRepository;

  constructor(repository: IEmployeeRepository) {
    this.repository = repository;
  }

  public async execute({ id }: GetEmployeeRequest): Promise<PrismaEmployee> {
    const employee = await this.repository.findById(id);

    if (!employee) {
      throw new CustomError("error_not_found", "Employee not found");
    }

    return employee;
  }
}
