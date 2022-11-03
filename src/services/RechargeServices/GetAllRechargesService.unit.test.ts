import { randNumber } from "@ngneat/falso";
import { Recharge } from "@prisma/client";
import { RechargeMapper } from "../../mappers";
import { IRechargeRepository } from "../../repositories/IRechargeRepository";
import { MockRechargeRepository } from "../../repositories/mocks/MockRechargeRepository";
import { GetAllRechargesServiceImpl } from "./GetAllRechargesService";
import { RechargeFactory } from "./RechargeFactory";

describe("Get All Recharges By Card Id Service", () => {
  const rechargeRepository: IRechargeRepository = new MockRechargeRepository();
  const service = new GetAllRechargesServiceImpl(rechargeRepository);

  it("Should be able to get all the recharges", async () => {
    const cardId = randNumber();
    const recharge = new RechargeFactory().generate({ cardId });
    const rechargesDB = [recharge, recharge, recharge];
    const rechargesDTO = rechargesDB.map((rechargeDB) =>
      new RechargeMapper().toDTO(rechargeDB)
    );

    jest
      .spyOn(rechargeRepository, "findByCardId")
      .mockResolvedValueOnce(rechargesDB);

    await expect(service.execute({ cardId })).resolves.toEqual(rechargesDTO);
    expect(rechargeRepository.findByCardId).toHaveBeenCalledWith(cardId);
  });

  it("Should return and empty array if there are no recharges", async () => {
    const cardId = randNumber();
    const rechargesDB: Recharge[] = [];
    const rechargesDTO = rechargesDB.map((rechargeDB) =>
      new RechargeMapper().toDTO(rechargeDB)
    );

    jest
      .spyOn(rechargeRepository, "findByCardId")
      .mockResolvedValueOnce(rechargesDB);

    await expect(service.execute({ cardId })).resolves.toEqual(rechargesDTO);
    expect(rechargeRepository.findByCardId).toHaveBeenCalledWith(cardId);
  });
});
