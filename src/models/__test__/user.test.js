const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeUser } = require("../../__test__/makeFakeData");
const User = require("../user");
const {
  makeFakeUserDb,
  makeFakeClientDb,
} = require("../../__test__/makeFakeDataDb");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("User Test - Model", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({});
  });

  it("Should register user successfully", async () => {
    const { username, password, rolId, groupId, active } = makeFakeUser();

    const userInstace = new User({
      username,
      password,
      rolId,
      groupId,
      active,
    });

    const { insertId } = await userInstace.register();
    const user = await dbInstance.getItem({
      tableName: "user",
      keyName: "id",
      keyValue: insertId,
    });
    expect(user.id).to.equal(insertId);
    expect(user.username).to.equal(username);
    expect(user.password).to.equal(password);
  });

  it("Should FAIL register for params invalid", async () => {
    const { username, password, rolId, groupId, active } = makeFakeUser();

    const userInstace = new User({
      username,
      password,
      rolId,
      groupId,
      active,
    });

    try {
      await userInstace.register();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
  it("Should getUserById return successfully", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    const user = await User.getUserById(params.id);
    expect(user[0].id).to.equal(params.id);
    expect(user[0].username).to.equal(params.username);
    expect(user[0].active).to.equal(1);
  });

  it("Should FAIL getUserById for params invalid", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    try {
      await User.getUserById();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should FAIL getUser for params invalid", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    try {
      await User.getUserById();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
  it("Should getUser return successfully", async () => {
    const params = makeFakeClientDb();
    await dbInstance.insert({
      tableName: "client",
      data: params,
    });

    const user = await User.getUser({
      username: params.username,
      type: "client",
    });
    expect(user[0].id).to.equal(params.id);
    expect(user[0].username).to.equal(params.username);
    expect(user[0].active).to.equal(1);
  });

  it("Should FAIL getUser for params invalid", async () => {
    const params = makeFakeClientDb();
    await dbInstance.insert({
      tableName: "client",
      data: params,
    });

    try {
      await User.getUser();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getAllGroups return successfully", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    const user = await User.getAllGroupUser();
    expect(user[0].id).to.equal(params.id);
    expect(user[0].username).to.equal(params.username);
    expect(user[0].active).to.equal(1);
  });

  it("Should updateUser return successfully", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });
    await User.updateUser({
      userId: params.id,
      active: false,
    });
    const user = await dbInstance.getItem({
      tableName: "user",
      keyName: "id",
      keyValue: params.id,
    });
    expect(user.id).to.equal(params.id);
    expect(user.username).to.equal(params.username);
    expect(user.active).to.equal(0);
  });

  it("Should FAIL updateUser for invalid params", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });
    try {
      await User.updateUser({
        active: false,
      });
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
});
