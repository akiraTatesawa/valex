import { CustomError } from "../../errors";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { MockEmployeeRepository } from "../../repositories/mocks/MockEmployeeRepository";
import { GetEmployeeServiceImpl } from "./GetEmployeeService";
import { EmployeeFactory } from "./EmployeeFactory";

describe("Get Employee Service", () => {
  const repository: IEmployeeRepository = new MockEmployeeRepository();
  const service = new GetEmployeeServiceImpl(repository);

  const employeeFactory = new EmployeeFactory();

  it("Should be able to get employee", async () => {
    const id = employeeFactory.createEmployeeId();
    const mockEmployee = employeeFactory.createEmployee({ id });

    jest.spyOn(repository, "findById").mockResolvedValueOnce(mockEmployee);

    await expect(service.execute({ id })).resolves.toEqual(mockEmployee);
    expect(repository.findById).toHaveBeenCalledWith(id);
  });

  it("Should throw error and not be able to get employee if does not exist", async () => {
    const id = employeeFactory.createEmployeeId();

    jest.spyOn(repository, "findById").mockResolvedValueOnce(null);

    await expect(service.execute({ id })).rejects.toEqual(
      new CustomError("error_not_found", "Employee not found")
    );
    expect(repository.findById).toHaveBeenCalledWith(id);
  });
});
