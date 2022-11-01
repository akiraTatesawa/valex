// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { TestHelpers } from "../helpers/index";
import { close, init, app } from "../../src/app";
import { cardScenariosFactory } from "../scenarios/index";

describe("PATCH /cards/:id/activate", () => {
  beforeEach(async () => {
    await new TestHelpers().cleanDB();
    await init();
  });

  afterEach(async () => {
    await close();
  });

  const server = supertest(app);
  const cardScenarios = cardScenariosFactory();

  it("[200]: Should be able to activate a card", async () => {
    const { activateCardData, id } = await cardScenarios.activateCardScenario();

    const response = await server
      .patch(`/cards/${id}/activate`)
      .send(activateCardData);

    expect(response.statusCode).toEqual(httpStatus.OK);
    expect(response.body).toEqual({});
  });

  it("[404]: Should not be able to activate card if it does not exist", async () => {
    const { activateCardData, id } = await cardScenarios.activateCardScenario();

    const response = await server
      .patch(`/cards/${id + 1}/activate`)
      .send(activateCardData);

    expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty("message", "Card not found");
  });

  it("[422]: Should not be able to activate card if the id is invalid", async () => {
    const { activateCardData } = await cardScenarios.activateCardScenario();

    const response = await server
      .patch(`/cards/invalid/activate`)
      .send(activateCardData);

    expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toHaveProperty("message");
  });

  it("[422]: Should not be able to activate card if the body is invalid", async () => {
    const { activateCardData, id } = await cardScenarios.activateCardScenario();

    const response = await server
      .patch(`/cards/${id}/activate`)
      .send({ ...activateCardData, invalid: "invalid" });

    expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toHaveProperty("message");
  });
});
