// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import { randNumber } from "@ngneat/falso";
import httpStatus from "http-status";
import { TestHelpers } from "../helpers";
import { init, close, app } from "../../src/app";
import { cardScenariosFactory } from "../scenarios";

describe("POST /cards/:id/recharge", () => {
  beforeEach(async () => {
    await new TestHelpers().cleanDB();
    await init();
  });

  afterEach(async () => {
    await close();
  });

  const server = supertest(app);
  const cardScenarios = cardScenariosFactory();

  it("[201]: Should be able to recharge the card", async () => {
    const { headers, id, requestData } =
      await cardScenarios.rechargeCardScenario({
        amount: randNumber({ min: 1 }),
      });

    const response = await server
      .post(`/cards/${id}/recharge`)
      .send(requestData)
      .set(headers);

    expect(response.statusCode).toEqual(httpStatus.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("amount", requestData.amount);
  });

  it("[404]: Should not be able to recharge the card if the card does not exist", async () => {
    const { headers } = await cardScenarios.companyEmployeeScenario();
    const id = randNumber();
    const requestData = {
      amount: randNumber({ min: 1 }),
    };

    const response = await server
      .post(`/cards/${id + 1}/recharge`)
      .send(requestData)
      .set(headers);

    expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty("message");
  });

  it("[400]: Should not be able to recharge the card if amount is less than zero", async () => {
    const { headers, id, requestData } =
      await cardScenarios.rechargeCardScenario({
        amount: randNumber({ max: 0 }),
      });

    const response = await server
      .post(`/cards/${id}/recharge`)
      .send(requestData)
      .set(headers);

    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty("message");
  });
});
