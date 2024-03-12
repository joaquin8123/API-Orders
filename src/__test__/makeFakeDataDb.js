const Fakerator = require("fakerator");
const faker = Fakerator("es-ES");

const makeFakeUserDb = (params) => {
  return {
    id: 1,
    username: faker.internet.userName(),
    password: faker.internet.password(6),
    rol_id: 1,
    group_id: 1,
    active: true,
    ...params,
  };
};

const makeFakeClientDb = (params) => {
  return {
    id: 1,
    name: faker.names.name(),
    address: faker.address.streetName(),
    date: "2024-03-15",
    city_id: 1,
    phone1: faker.phone.number(),
    dni: String(faker.random.number(8)),
    username: faker.internet.userName(),
    password: faker.internet.password(6),
    rol_id: 1,
    active: true,
    ...params,
  };
};

const makeFakeOrderDb = (params) => {
  return {
    client_id: 1,
    products: [
      {
        product_id: 1,
        quantity: 2,
        discount: 0,
      },
    ],
    ...params,
  };
};

const makeFakeProductDb = (params) => {
  return {
    id: 1,
    name: faker.names.name(),
    address: faker.address.streetName(),
    date: "2024-03-15",
    city_id: 1,
    phone1: faker.phone.number(),
    dni: String(faker.random.number(8)),
    username: faker.internet.userName(),
    password: faker.internet.password(6),
    rol_id: 1,
    active: true,
    ...params,
  };
};

module.exports = {
  makeFakeUserDb,
  makeFakeClientDb,
  makeFakeOrderDb,
  makeFakeProductDb,
};
