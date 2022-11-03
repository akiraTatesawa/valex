import { randNumber } from "@ngneat/falso";
import { IRechargeRepository } from "../../repositories/IRechargeRepository";
import { MockRechargeRepository } from "../../repositories/mocks/MockRechargeRepository";
import { CreateRechargeServiceImpl } from "./CreateRechargeService";
import { CardValidator } from "../CardServices/CardValidator";
import { MockCardValidator } from "../CardServices/mocks/MockCardValidator";
import { RechargeFactory } from "./RechargeFactory";
import { RechargeMapper } from "../../mappers/RechargeMapper";

describe("Create Recharge Service", () => {
  const rechargeRepository: IRechargeRepository = new MockRechargeRepository();
  const cardValidator: CardValidator = new MockCardValidator();

  const service = new CreateRechargeServiceImpl(
    rechargeRepository,
    cardValidator
  );

  it("Should be able to Create a Recharge", async () => {
    const recharge = {
      amount: randNumber({ min: 1 }),
      cardId: randNumber(),
    };
    const mockRecharge = new RechargeFactory().generate({ ...recharge });
    const mockRechargeDTO = new RechargeMapper().toDTO(mockRecharge);

    jest
      .spyOn(rechargeRepository, "create")
      .mockResolvedValueOnce(mockRecharge);

    await expect(service.execute(recharge)).resolves.toEqual(mockRechargeDTO);
    expect(rechargeRepository.create).toHaveBeenCalled();
  });
});
