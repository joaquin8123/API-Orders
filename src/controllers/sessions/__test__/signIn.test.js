// const faker = require('fakerator')('es-ES');
// import { expect } from '../../../../__test__/defaultTestDependencies';
// import { expectInstanceThrowsAsync } from '../../../../__test__/expectThrowsAsync';
// import { makeFakeUserCredentials } from '../../../../__test__/mocks/makeUserCredentials';
// import { ERRORS_CODES, ERRORS_MESSAGES } from '../../../constants';
// import { signIn } from '..';
// import { getFakeHttpLambdaHostUrl } from '../../../../__test__/mocks/makeFakeHttpLambdaEvent';
// import factories from '../../../../__test__/factories';
// import { clientsModel } from '../../../models/dynamo';
// import {
//   createClientsTable,
//   deleteClientsTable,
// } from '../../../../__test__/manageDynamoTables';
// import { encrypt } from '../../../helpers/cryptoHelpers';
// describe('Sign In Controller - Integration Tests', () => {
//   before(async () => {
//     await createClientsTable();
//   });
//   after(async () => {
//     await deleteClientsTable();
//   });
//   it('Should login user successfully and return tokens object', async () => {
//     const { username, password } = makeFakeUserCredentials();
//     await factories.create(clientsModel, { username, password: encrypt(password) });
//     const params = { username, password };
//     const hostUrl = getFakeHttpLambdaHostUrl();
//     const res = await signIn({ params, hostUrl });
//     expect(res).to.have.all.keys('status', 'response');
//     const { response, status } = res;
//     expect(status).to.be.equal(200);
//     expect(response).to.have.property('accessToken').that.is.a('string');
//     expect(response).to.have.property('refreshToken').that.is.a('string');
//   });

//   it('Should throw an error due to invalid password', async () => {
//     const { username } = makeFakeUserCredentials();
//     await factories.create(clientsModel, { username });
//     const params = {
//       username,
//       password: faker.random.string(16),
//       event: getFakeHttpLambdaHostUrl(),
//     };

//     const thrownError = await expectInstanceThrowsAsync(() => signIn({ params }), Error);
//     expect(thrownError.message).to.be.equal(ERRORS_MESSAGES.INVALID_USERNAME_OR_PASSWORD);
//     expect(thrownError.code).to.be.equal(ERRORS_CODES.INVALID_CREDENTIALS);
//     expect(thrownError.status).to.be.equal(400);
//   });

//   it('Should throw an error due to missing user', async () => {
//     const params = makeFakeUserCredentials();
//     const thrownError = await expectInstanceThrowsAsync(() => signIn({ params }), Error);
//     expect(thrownError.message).to.be.equal(ERRORS_MESSAGES.INVALID_USERNAME_OR_PASSWORD);
//     expect(thrownError.code).to.be.equal(ERRORS_CODES.INVALID_CREDENTIALS);
//     expect(thrownError.status).to.be.equal(400);
//   });
// });
