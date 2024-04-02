const faker = require('fakerator')('es-ES');
import { expect } from '../../../../__test__/defaultTestDependencies';
import { expectInstanceThrowsAsync } from '../../../../__test__/expectThrowsAsync';
import { ERRORS_CODES, ERRORS_MESSAGES, USER_CREATED_OK } from '../../../constants';
import { signUp } from '..';
import factories from '../../../../__test__/factories';
import { clientsModel } from '../../../models/dynamo';
import {
  createClientsTable,
  deleteClientsTable,
} from '../../../../__test__/manageDynamoTables';
import { decrypt } from '../../../helpers/cryptoHelpers';
import { makeFakeClient } from '../../../../__test__/mocks/makeFakeClient';
describe('Sign Up Controller - Integration Tests', () => {
  before(async () => {
    await createClientsTable();
  });
  after(async () => {
    await deleteClientsTable();
  });
  it('Should register user successfully', async () => {
    const params = makeFakeClient({ plainPassword: true });
    const { username, password, email } = params;
    const res = await signUp({ params });
    expect(res).to.have.all.keys('status', 'response');
    const { response, status } = res;
    expect(status).to.be.equal(201);
    expect(response).to.deep.equal({ message: USER_CREATED_OK });

    // Should have persisted client user:
    const retrievedClient = await clientsModel.findOne({ key: { username } });
    expect(retrievedClient.email).to.be.equal(email);
    expect(
      decrypt(retrievedClient.password),
      'Password should have been encrypted',
    ).to.be.equal(password);
  });

  it('Should fail because already exists user with same username', async () => {
    const username = faker.internet.userName();
    await factories.create(clientsModel, { username });

    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        username,
      },
    });

    const thrownError = await expectInstanceThrowsAsync(() => signUp({ params }), Error);
    expect(thrownError.message).to.be.equal(ERRORS_MESSAGES.USER_ALREADY_EXISTS);
    expect(thrownError.code).to.be.equal(ERRORS_CODES.USER_ALREADY_EXISTS);
    expect(thrownError.status).to.be.equal(400);
  });

  it('Should return a Bad Request error because weak password', async () => {
    const params = makeFakeClient({
      overrides: {
        password: faker.random.number(999),
      },
    });
    const thrownError = await expectInstanceThrowsAsync(() => signUp({ params }), Error);
    expect(thrownError.message).to.be.equal(
      "Error: password doesn't pass regex function.",
    );
    expect(thrownError.code).to.be.equal(ERRORS_CODES.VALIDATION_FAILED_USER);
    expect(thrownError.status).to.be.equal(400);
  });

  it('Should return a Bad Request error because missing "email"', async () => {
    const params = makeFakeClient({ plainPassword: true });
    delete params.email;
    const thrownError = await expectInstanceThrowsAsync(() => signUp({ params }), Error);
    expect(thrownError.message).to.be.equal("Error: email doesn't pass regex function.");
    expect(thrownError.code).to.be.equal(ERRORS_CODES.VALIDATION_FAILED_USER);
    expect(thrownError.status).to.be.equal(400);
  });
});
