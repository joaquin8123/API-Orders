import MakeFakeDb from '../../../../__test__/MakeFakeDb';
import { makeFakeClient } from '../../../../__test__/mocks/makeFakeClient';
import { makeFakeUserCredentials } from '../../../../__test__/mocks/makeUserCredentials';
import { expect } from '../../../../__test__/defaultTestDependencies';
import { expectThrowsAsync } from '../../../../__test__/expectThrowsAsync';

import makeGetUserUseCase from '../getUser';
import { ERRORS_MESSAGES } from '../../../constants';

describe('Get User - Unit Test', () => {
  it('Should retrieve user correctly', async () => {
    const { username } = makeFakeUserCredentials();
    const clientsModel = new MakeFakeDb();
    clientsModel.findOne = async ({ _params }) => makeFakeClient();
    const getUser = makeGetUserUseCase({ dependencies: { clientsModel } });
    const res = await getUser({ params: { username } });
    expect(res).to.be.an('object');
  });

  it('Should fail due to missing user', async () => {
    const { username } = makeFakeUserCredentials();
    const clientsModel = new MakeFakeDb();
    clientsModel.findOne = async ({ _params }) => {
      throw Error(ERRORS_MESSAGES.MISSING_USER);
    };
    const getUser = makeGetUserUseCase({ dependencies: { clientsModel } });
    await expectThrowsAsync(
      () => getUser({ params: { username } }),
      ERRORS_MESSAGES.MISSING_USER,
    );
  });
});
