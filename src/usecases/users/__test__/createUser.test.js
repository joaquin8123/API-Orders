import MakeFakeDb from "../../../../__test__/MakeFakeDb";
import { makeFakeClient } from "../../../../__test__/mocks/makeFakeClient";
import { expect } from "../../../../__test__/defaultTestDependencies";
import makeCreateUserUsecase, { createUserUsecase } from "../createUser";
import { DEFAULT_SAVE_USER_RESPONSE } from "../../../../__test__/clientTestHelpers";
import { clientsEntity } from "../../../entities/clients";
import { makeFakeClientDb } from "../../../__test__/makeFakeDataDb";

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});
describe.only("Create User - Use case Test", () => {
  it("Should create a client successfuly", async () => {
    const params = makeFakeClientDb();
    createUserUsecase;
    const response = await createUser({ params });
    expect(response).to.deep.equal(DEFAULT_SAVE_USER_RESPONSE);
  });
});
