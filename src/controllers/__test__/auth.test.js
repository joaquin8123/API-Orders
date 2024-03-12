const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeUser, makeFakeClient } = require("../../__test__/makeFakeData");
const { register, login, resetPassword } = require("../auth");
const bcrypt = require("bcrypt");
const {
  makeFakeUserDb,
  makeFakeClientDb,
} = require("../../__test__/makeFakeDataDb");
const { defaultExpect } = require("../../__test__/defaultExpect");
const Fakerator = require("fakerator");
const faker = Fakerator("es-ES");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Auth - Controller", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({});
  });

  it("Should register user successfully", async () => {
    const params = makeFakeUser();
    const response = await register({ body: params });
    defaultExpect({
      response,
      code: 201,
      msg: "REGISTER_USER_SUCCESS",
    });
  });

  it("Should register client successfully", async () => {
    const params = makeFakeClient();
    const response = await register({ body: params });
    defaultExpect({
      response,
      code: 201,
      msg: "REGISTER_CLIENT_SUCCESS",
    });
  });

  it("Should return user already exists", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    const response = await register({ body: { ...params, type: "user" } });

    expect(response).to.deep.equal({
      success: false,
      code: 401,
      msg: "USER_EXISTS",
      data: "User already exists",
    });
  });

  it("Should return client already exists", async () => {
    const params = makeFakeClientDb();
    await dbInstance.insert({
      tableName: "client",
      data: params,
    });

    const response = await register({ body: { ...params, type: "client" } });

    expect(response).to.deep.equal({
      success: false,
      code: 401,
      msg: "USER_EXISTS",
      data: "User already exists",
    });
  });

  it("Should FAIL for groupId missing", async () => {
    const params = makeFakeUser({ groupId: "fake" });
    const response = await register({ body: params });
    defaultExpect({
      response,
      isSuccess: false,
      code: 500,
      msg: "REGISTER_ERROR",
    });
  });

  it("Should return 401 unexists login", async () => {
    const response = await login({
      body: { username: "fake", type: "user" },
    });

    defaultExpect({
      response,
      code: 401,
      msg: "UNEXISTENT_USER",
      isSuccess: false,
    });
  });

  it("Should return 401 unactive login", async () => {
    const params = makeFakeUserDb({ active: false });
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });

    const response = await login({
      body: { username: params.username, type: "user" },
    });

    defaultExpect({
      response,
      code: 401,
      msg: "UNACTIVE_USER",
      isSuccess: false,
    });
  });
  it("Should return 401 incorrect passwrd login", async () => {
    const params = makeFakeUserDb();
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });
    const { username, password } = params;
    const response = await login({
      body: { username, password, type: "user" },
    });

    defaultExpect({
      response,
      code: 401,
      msg: "INCORRECT_PASSWORD",
      isSuccess: false,
    });
  });

  it("Should login successfully", async () => {
    const passwordOriginal = faker.internet.password(6);
    const hashedPassword = await bcrypt.hash(passwordOriginal, 10);
    const params = makeFakeUserDb({ password: hashedPassword });
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });
    const response = await login({
      body: {
        username: params.username,
        password: passwordOriginal,
        type: "user",
      },
    });

    defaultExpect({
      response,
      code: 200,
      msg: "LOGIN_SUCCESS",
    });
  });

  it("Should reset password successfully", async () => {
    const passwordOriginal = faker.internet.password(6);
    const hashedPassword = await bcrypt.hash(passwordOriginal, 10);
    const params = makeFakeUserDb({ password: hashedPassword });
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });
    const response = await resetPassword({
      body: {
        username: params.username,
        password: passwordOriginal,
        type: "user",
        isReset: true,
      },
    });

    defaultExpect({
      response,
      code: 200,
      msg: "RESET_PASSWORD_SUCCESS",
    });
  });

  it("Should change password successfully", async () => {
    const passwordOriginal = faker.internet.password(6);
    const newPassword = faker.internet.password(6);
    const hashedPassword = await bcrypt.hash(passwordOriginal, 10);
    const params = makeFakeUserDb({ password: hashedPassword });
    await dbInstance.insert({
      tableName: "user",
      data: params,
    });
    const response = await resetPassword({
      body: {
        username: params.username,
        password: passwordOriginal,
        newPassword,
        type: "user",
      },
    });

    defaultExpect({
      response,
      code: 200,
      msg: "NEW_PASSWORD_SUCCESS",
    });
  });
});
