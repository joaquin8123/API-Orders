const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeClient } = require("../../__test__/makeFakeData");
const Client = require("../client");
const { makeFakeClientDb } = require("../../__test__/makeFakeDataDb");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Client Test - Model", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({});
  });

  it("Should register client successfully", async () => {
    const { username, password, name, address, rolId, phone, cityId, date } =
      makeFakeClient();
    const clientInstace = new Client({
      username,
      password,
      name,
      address,
      phone,
      date,
      cityId,
      rolId,
    });
    const { insertId } = await clientInstace.register();
    const client = await dbInstance.getItem({
      tableName: "client",
      keyName: "id",
      keyValue: insertId,
    });
    expect(client.id).to.equal(insertId);
    expect(client.name).to.equal(name);
    expect(client.username).to.equal(username);
    expect(client.password).to.equal(password);
  });
  it("Should getClientById return successfully", async () => {
    const params = makeFakeClientDb();
    await dbInstance.insert({
      tableName: "client",
      data: params,
    });

    const client = await Client.getClient({ clientId: params.id });
    expect(client.id).to.equal(params.id);
    expect(client.name).to.equal(params.name);
    expect(client.username).to.equal(params.username);
    expect(client.password).to.equal(params.password);
  });
});
