import MakeFakeDb from '../../../../__test__/MakeFakeDb';
import { makeFakeClient } from '../../../../__test__/mocks/makeFakeClient';
import { expect } from '../../../../__test__/defaultTestDependencies';
import makeCreateUserUsecase from '../createUser';
import { DEFAULT_SAVE_USER_RESPONSE } from '../../../../__test__/clientTestHelpers';
import { clientsEntity } from '../../../entities/clients';
describe('Create User - Unit Test', () => {
  const clientsModel = new MakeFakeDb();
  clientsModel.createIfNotExists = async () =>
    Promise.resolve(DEFAULT_SAVE_USER_RESPONSE);

  const createUser = makeCreateUserUsecase({
    dependencies: {
      clientsModel,
      clientsEntity,
    },
  });
  it('Should create a user record properly', async () => {
    const params = makeFakeClient({ plainPassword: true });
    const response = await createUser({ params });
    expect(response).to.deep.equal(DEFAULT_SAVE_USER_RESPONSE);
  });
});
