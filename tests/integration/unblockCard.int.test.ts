// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";

import httpStatus from "http-status";
import { TestHelpers } from "../helpers";
import { close, init, app } from "../../src/app";
import { cardScenariosFactory } from "../scenarios";

describe("PATCH /cards/:id/unblock", () => {
  beforeEach(async () => {
    await new TestHelpers().cleanDB();
    await init();
  });

  afterEach(async () => {
    await close();
  });

  const server = supertest(app);
  const cardScenarios = cardScenariosFactory();

  it("[200]: Should be able to unblock the card", async () => {
    const { id, password } = await cardScenarios.blockCardScenario({
      isBlocked: true,
    });

    const response = await server
      .patch(`/cards/${id}/unblock`)
      .send({ password });

    expect(response.statusCode).toEqual(httpStatus.OK);
    expect(response.body).toEqual({});
  });

  it("[422]: Should not be able to unblock the card if its already unblocked", async () => {
    const { id, password } = await cardScenarios.blockCardScenario({
      isBlocked: false,
    });

    const response = await server
      .patch(`/cards/${id}/unblock`)
      .send({ password });

    expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toHaveProperty("message");
  });

  it("[400]: Should not be able to unblock the card if the body is invalid", async () => {
    const { id, password } = await cardScenarios.blockCardScenario({
      isBlocked: true,
    });

    const response = await server
      .patch(`/cards/${id}/unblock`)
      .send({ password, invalid: "invalid" });

    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty("message");
  });

  it("[404]: Should not be able to unblock the card if the card does not exist", async () => {
    const { id, password } = await cardScenarios.blockCardScenario({
      isBlocked: true,
    });

    const response = await server
      .patch(`/cards/${id + 1}/unblock`)
      .send({ password });

    expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty("message");
  });
});
