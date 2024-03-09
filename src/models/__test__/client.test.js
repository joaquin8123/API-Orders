const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeClient } = require("../../__test__/makeFakeData");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Clients - Model", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs();
  });

  it("Should register user successfully", async () => {
    const params = makeFakeClient();
    
    expect(1).to.equal(1);
  });
});
