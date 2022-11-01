import { IEmployeeRepository } from "../IEmployeeRepository";

export class MockEmployeeRepository implements IEmployeeRepository {
  findById = jest.fn();
}
