import { PrismaCardRepository } from "../../repositories/prisma/CardRepository";
import { PrismaCompanyRepository } from "../../repositories/prisma/CompanyRepository";
import { PrismaEmployeeRepository } from "../../repositories/prisma/EmployeeRepository";
import { GetEmployeeServiceImpl } from "../../services/EmployeeServices/GetEmployeeService";
import { GetCompanyServiceImpl } from "../../services/CompanyServices/GetCompanyService";
import { CreateCardServiceImpl } from "../../services/CardServices/CreateCardService";
import { CreateCardController } from "./CreateCardController";

export function createCardControllerFactory(): CreateCardController {
  const cardRepository = new PrismaCardRepository();

  const employeeRepository = new PrismaEmployeeRepository();
  const getEmployeeService = new GetEmployeeServiceImpl(employeeRepository);

  const companyRepository = new PrismaCompanyRepository();
  const getCompanyService = new GetCompanyServiceImpl(companyRepository);

  const createCardService = new CreateCardServiceImpl(
    cardRepository,
    getCompanyService,
    getEmployeeService
  );

  return new CreateCardController(createCardService);
}