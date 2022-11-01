import { ICardRepository } from "../../repositories/ICardRepository";
import { MockCardRepository } from "../../repositories/mocks/MockCardRepository";
import { GetCompanyServiceImpl } from "../CompanyServices/GetCompanyService";
import { MockCompanyRepository } from "../../repositories/mocks/MockCompanyRepository";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { MockEmployeeRepository } from "../../repositories/mocks/MockEmployeeRepository";
import { GetEmployeeServiceImpl } from "../EmployeeServices/GetEmployeeService";
import { CreateCardServiceImpl } from "./CreateCardService";
import { CompanyFactory } from "../CompanyServices/CompanyFactory";
import { EmployeeFactory } from "../EmployeeServices/EmployeeFactory";
import { CardFactory } from "./CardFactory";
import { BusinessType } from "../../types/business";
import { CustomError } from "../../errors";

describe("Create Card Service", () => {
  const cardRepository: ICardRepository = new MockCardRepository();

  const companyRepository: ICompanyRepository = new MockCompanyRepository();
  const getCompanyService = new GetCompanyServiceImpl(companyRepository);

  const employeeRepository: IEmployeeRepository = new MockEmployeeRepository();
  const getEmployeeService = new GetEmployeeServiceImpl(employeeRepository);

  const service = new CreateCardServiceImpl(
    cardRepository,
    getCompanyService,
    getEmployeeService
  );

  it("Should be able to create a card", async () => {
    const mockCompany = new CompanyFactory().createCompany();
    const mockEmployee = new EmployeeFactory().createEmployee();
    const { card: mockCard } = new CardFactory().createCard();

    const { apikey } = mockCompany;
    const { id: employeeId } = mockEmployee;
    const type: BusinessType = "education";

    jest
      .spyOn(cardRepository, "findByTypeAndEmployeeId")
      .mockResolvedValueOnce(null);
    jest.spyOn(cardRepository, "create").mockResolvedValueOnce(mockCard);
    jest
      .spyOn(getEmployeeService, "execute")
      .mockResolvedValueOnce(mockEmployee);
    jest.spyOn(getCompanyService, "execute").mockResolvedValueOnce(mockCompany);

    await expect(
      service.execute({
        apikey,
        employeeId,
        type,
      })
    ).resolves.not.toThrow();

    expect(getCompanyService.execute).toHaveBeenCalledWith({ apiKey: apikey });
    expect(getEmployeeService.execute).toHaveBeenCalledWith({ id: employeeId });
    expect(cardRepository.findByTypeAndEmployeeId).toHaveBeenCalledWith(
      type,
      employeeId
    );
    expect(cardRepository.create).toHaveBeenCalled();
  });

  it("Should throw an error and not be able to create a card if user already has a card with same type", async () => {
    const mockCompany = new CompanyFactory().createCompany();
    const mockEmployee = new EmployeeFactory().createEmployee();
    const { card: mockCard } = new CardFactory().createCard();
    const { apikey } = mockCompany;
    const { id: employeeId } = mockEmployee;
    const type: BusinessType = "education";

    jest
      .spyOn(cardRepository, "findByTypeAndEmployeeId")
      .mockResolvedValueOnce(mockCard);
    jest
      .spyOn(getEmployeeService, "execute")
      .mockResolvedValueOnce(mockEmployee);
    jest.spyOn(getCompanyService, "execute").mockResolvedValueOnce(mockCompany);

    await expect(
      service.execute({
        apikey,
        employeeId,
        type,
      })
    ).rejects.toEqual(
      new CustomError(
        "error_conflict",
        `The employee already has a ${type} voucher card`
      )
    );

    expect(getCompanyService.execute).toHaveBeenCalledWith({ apiKey: apikey });
    expect(getEmployeeService.execute).toHaveBeenCalledWith({ id: employeeId });
    expect(cardRepository.findByTypeAndEmployeeId).toHaveBeenCalledWith(
      type,
      employeeId
    );
    expect(cardRepository.create).not.toHaveBeenCalled();
  });
});
