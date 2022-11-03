import { randNumber } from "@ngneat/falso";

import { IBusinessRepository } from "../../repositories/IBusinessRepository";
import { MockBusinessRepository } from "../../repositories/mocks/MockBusinessRepository";
import { GetBusinessByIdServiceImpl } from "./GetBusinessByIdService";
import { BusinessFactory } from "./BusinessFactory";
import { CustomError } from "../../errors";

describe("Get Business By Id Service", () => {
  const businessRepository: IBusinessRepository = new MockBusinessRepository();
  const service = new GetBusinessByIdServiceImpl(businessRepository);

  it("Should be able to get business by id", async () => {
    const id = randNumber();
    const business = new BusinessFactory().generateBusiness({ id });

    jest.spyOn(businessRepository, "findById").mockResolvedValueOnce(business);

    await expect(service.execute({ id })).resolves.toEqual(business);
    expect(businessRepository.findById).toHaveBeenCalledWith(id);
  });

  it("Should not be able to get business if it does not exist", async () => {
    const id = randNumber();

    jest.spyOn(businessRepository, "findById").mockResolvedValueOnce(null);

    await expect(service.execute({ id })).rejects.toEqual(
      new CustomError("error_not_found", "Business not found")
    );
    expect(businessRepository.findById).toHaveBeenCalledWith(id);
  });
});
