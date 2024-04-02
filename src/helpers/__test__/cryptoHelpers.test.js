import Fakerator from 'fakerator';
import { expect } from 'chai';
import { decrypt, encrypt } from '../cryptoHelpers';

const faker = Fakerator('es-ES');

describe('Crypto Helpers', () => {
  it('Should encrypt plain password correctly', () => {
    const plainPass = faker.random.string(16);
    const res = encrypt(plainPass);
    expect(res).to.be.a('string');
  });

  it('Should decrypt an encrypted password correctly', () => {
    const plainPass = faker.random.string(16);
    const encryptedPassword = encrypt(plainPass);
    const decryptResult = decrypt(encryptedPassword);
    expect(decryptResult).to.be.equal(plainPass);
  });
});
