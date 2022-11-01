import { MockCompanyRepository } from "../../repositories/mocks/MockCompanyRepository";
import { GetCompanyServiceImpl } from "./GetCompanyService";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";
import { CustomError } from "../../errors";
import { CompanyFactory } from "./CompanyFactory";

describe("Get Company Service", () => {
  const repository: ICompanyRepository = new MockCompanyRepository();
  const service = new GetCompanyServiceImpl(repository);

  const companyFactory = new CompanyFactory();

  it("Should be able to get company", async () => {
    const apiKey = companyFactory.createApiKey();
    const mockCompany = companyFactory.createCompany({ apikey: apiKey });

    jest.spyOn(repository, "findByApiKey").mockResolvedValueOnce(mockCompany);

    await expect(service.execute({ apiKey })).resolves.toEqual(mockCompany);
    expect(repository.findByApiKey).toHaveBeenCalledWith(apiKey);
  });

  it("Should throw error and not be able to get company if apiKey is invalid", async () => {
    const apiKey = companyFactory.createApiKey();

    jest.spyOn(repository, "findByApiKey").mockResolvedValueOnce(null);

    await expect(service.execute({ apiKey })).rejects.toEqual(
      new CustomError("error_not_found", "Company not found")
    );
    expect(repository.findByApiKey).toHaveBeenCalledWith(apiKey);
  });
});
