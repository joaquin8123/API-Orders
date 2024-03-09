const Fakerator = require("fakerator");
const faker = Fakerator("es-ES");

const makeFakeCategory = (params) => {
  return {
    id: 1,
    name: faker.lorem.word(),
    ...params,
  };
};

const makeFakeState = (params) => {
  return {
    id: 1,
    name: faker.address.state(),
    ...params,
  };
};

const makeFakeCity = (params) => {
  return {
    id: 1,
    name: faker.address.city(),
    state_id: 1,
    cp: faker.address.postCode(),
    ...params,
  };
};

const makeFakeRol = (params) => {
  return {
    id: 1,
    name: "USER",
    ...params,
  };
};

const makeFakeClient = (params) => {
  return {
    id: 1,
    name: faker.names.name(),
    address: faker.address.streetName(),
    date: "2024-03-15",
    city_id: 1,
    phone1: faker.phone.number(),
    phone2: faker.phone.number(),
    dni: String(faker.random.number(8)),
    username: faker.internet.userName(),
    password: faker.internet.password(6),
    rol_id: 1,
    ...params,
  };
};

module.exports = {
  makeFakeCategory,
  makeFakeState,
  makeFakeCity,
  makeFakeRol,
  makeFakeClient,
};
