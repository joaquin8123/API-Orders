const faker = require("fakerator")("es-ES");

import { clientsEntity } from "..";
import { expect } from "../../../../__test__/defaultTestDependencies";
import { expectCodeThrowsAsync } from "../../../../__test__/expectThrowsAsync";
import { makeFakeClient } from "../../../../__test__/mocks/makeFakeClient";
import { USER_KEYS } from "../../../constants";
import { decrypt } from "../../../helpers/cryptoHelpers";

describe("Create client - Entity", () => {
  it("Should validate client properly", () => {
    const params = makeFakeClient({ plainPassword: true });
    const res = clientsEntity({ params });
    expect(res).to.have.all.keys(USER_KEYS);
    expect(
      decrypt(res.password),
      "Password should have been encrypted"
    ).to.be.equal(params.password);
  });

  it("Error - Invalid username", async () => {
    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        username: 5,
      },
    });
    await expectCodeThrowsAsync(
      () => clientsEntity({ params }),
      "usernameError"
    );
  });

  it("Error - Invalid password regex", async () => {
    const params = makeFakeClient({
      overrides: {
        password: faker.internet.userName(),
      },
    });
    await expectCodeThrowsAsync(
      () => clientsEntity({ params }),
      "passwordError"
    );
  });

  it("Error - Missing password", async () => {
    const params = makeFakeClient();
    delete params.password;
    await expectCodeThrowsAsync(
      () => clientsEntity({ params }),
      "passwordError"
    );
  });

  it("Error - Invalid email regex", async () => {
    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        email: "invalid_email",
      },
    });
    await expectCodeThrowsAsync(() => clientsEntity({ params }), "emailError");
  });
  it("Error - Missing email", async () => {
    const params = makeFakeClient({ plainPassword: true });
    delete params.email;
    await expectCodeThrowsAsync(() => clientsEntity({ params }), "emailError");
  });

  it("Error - Invalid company", async () => {
    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        company: 6,
      },
    });
    await expectCodeThrowsAsync(
      () => clientsEntity({ params }),
      "companyError"
    );
  });

  it("Error - Invalid active", async () => {
    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        active: 6,
      },
    });
    await expectCodeThrowsAsync(() => clientsEntity({ params }), "activeError");
  });

  it("Error - Invalid countryCode (must be a string)", async () => {
    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        countryCode: 6,
      },
    });
    await expectCodeThrowsAsync(
      () => clientsEntity({ params }),
      "countryCodeError"
    );
  });

  it("Error - Invalid countryCode (must have only two characters)", async () => {
    const params = makeFakeClient({
      plainPassword: true,
      overrides: {
        countryCode: faker.random.string(3),
      },
    });
    await expectCodeThrowsAsync(
      () => clientsEntity({ params }),
      "countryCodeError"
    );
  });
});
