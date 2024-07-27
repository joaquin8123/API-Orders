// const faker = require('fakerator')('es-ES');
// import { makeFakeUserCredentials } from '../../../../__test__/mocks/makeUserCredentials';
// import { expect } from '../../../../__test__/defaultTestDependencies';
// import { expectThrowsAsync } from '../../../../__test__/expectThrowsAsync';
// import { createUser, getUser, verifyPasswordHash } from '../../users';
// import {
//   createClientsTable,
//   deleteClientsTable,
// } from '../../../../__test__/manageDynamoTables';
// import factories from '../../../../__test__/factories';
// import { clientsModel } from '../../../models/dynamo';
// import { decrypt, encrypt } from '../../../helpers/cryptoHelpers';
// import { makeFakeClient } from '../../../../__test__/mocks/makeFakeClient';
// import { DEFAULT_SAVE_USER_RESPONSE } from '../../../../__test__/clientTestHelpers';
// import { ERRORS_MESSAGES, USER_KEYS } from '../../../constants';

// describe('Users Use Cases - Integration', () => {
//   before(async () => {
//     await createClientsTable();
//   });
//   after(async () => {
//     await deleteClientsTable();
//   });
//   describe('Get User ', () => {
//     it('Should retrieve user correctly', async () => {
//       const username = faker.internet.userName();
//       await factories.create(clientsModel, { username });
//       const res = await getUser({ params: { username } });
//       expect(res).to.be.an('object');
//       expect(res).to.be.have.all.keys(USER_KEYS);
//     });

//     it('Should fail due to missing user', async () => {
//       const { username } = makeFakeUserCredentials();
//       await expectThrowsAsync(
//         () => getUser({ params: { username } }),
//         ERRORS_MESSAGES.MISSING_USER,
//       );
//     });

//     it('Should fail because retrieved user is not active', async () => {
//       const username = faker.internet.userName();
//       await factories.create(clientsModel, { username, active: false });

//       await expectThrowsAsync(
//         () => getUser({ params: { username } }),
//         ERRORS_MESSAGES.MISSING_USER,
//       );
//     });
//   });

//   describe('Create User ', () => {
//     it('Should create a client user properly', async () => {
//       const username = faker.internet.userName();
//       const params = makeFakeClient({
//         plainPassword: true,
//         overrides: {
//           username,
//         },
//       });
//       const response = await createUser({ params });
//       expect(response).to.deep.equal(DEFAULT_SAVE_USER_RESPONSE);

//       // Should have persisted client user:
//       const retrievedClient = await clientsModel.findOne({ key: { username } });
//       expect(retrievedClient.username).to.be.equal(username);
//       expect(retrievedClient.company).to.be.equal(params.company);
//       expect(retrievedClient.email).to.be.equal(params.email);
//       expect(
//         decrypt(retrievedClient.password),
//         'Password should have been encrypted',
//       ).to.be.equal(params.password);
//     });

//     it('Should fail because missing "username" property', async () => {
//       const params = makeFakeClient({
//         plainPassword: true,
//       });
//       delete params.username;
//       await expectThrowsAsync(
//         () => createUser({ params }),
//         'Error: username must have a valid string.',
//       );
//     });

//     it('Should fail because already exists user with same username', async () => {
//       const username = faker.internet.userName();
//       await factories.create(clientsModel, { username });

//       const params = makeFakeClient({
//         plainPassword: true,
//         overrides: {
//           username,
//         },
//       });

//       // Dynamo DB should throws an error because existing record with this username
//       await expectThrowsAsync(
//         () => createUser({ params }),
//         ERRORS_MESSAGES.USER_ALREADY_EXISTS,
//       );
//     });
//   });

//   describe('Verify Password Hash', () => {
//     it('Should throw because mismatch passwords', async () => {
//       const fakePlainPassword = faker.random.string(16);
//       const passwordInput = faker.random.string(18);
//       const user = { password: encrypt(fakePlainPassword) };
//       await expectThrowsAsync(
//         () => verifyPasswordHash({ params: { user, passwordInput } }),
//         ERRORS_MESSAGES.INVALID_CREDENTIALS,
//       );
//     });
//   });
// });
