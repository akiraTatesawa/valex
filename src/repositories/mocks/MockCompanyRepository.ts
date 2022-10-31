import { ICompanyRepository } from "../ICompanyRepository";

export class MockCompanyRepository implements ICompanyRepository {
  findByApiKey = jest.fn();
}
