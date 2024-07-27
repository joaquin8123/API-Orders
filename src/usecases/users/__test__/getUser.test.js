const { ERRORS_MESSAGES } = require("../../../constants");
const { makeFakeUserDb } = require("../../../__test__/makeFakeDataDb");
const dbInstance = require("../../../db");
const { getUser } = require("../index");
const { initalConfigs } = require("../../../__test__/initalConfig");
const { expect } = require("chai");
const { expectThrowsAsync } = require("../../../__test__/defaultExpect");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Get User - Use case Test", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({});
  });
  it("Should get user successfully", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    const response = await getUser({ params: { ...params, type: "user" } });
    expect(response.length).to.be.equal(1);
    const { id, username, active } = response[0];
    expect(id).to.be.equal(params.id);
    expect(username).to.be.equal(params.username);
    expect(active).to.be.equal(1);
  });
  it("Should fail due to missing user", async () => {
    await expectThrowsAsync(
      () => getUser({ params: { username: "fake" } }),
      ERRORS_MESSAGES.MISSING_USER
    );
  });
  it("Should fail due to unactive user", async () => {
    const params = makeFakeUserDb({ active: false });
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    await expectThrowsAsync(
      () => getUser({ params: { username: params.username } }),
      ERRORS_MESSAGES.MISSING_USER
    );
  });
});
