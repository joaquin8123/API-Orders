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

const makeFakeGroup = (params) => {
  return {
    id: 1,
    name: "ADMIN",
    ...params,
  };
};

const makeFakeUser = (params) => {
  return {
    id: 1,
    name: faker.names.name(),
    address: faker.address.streetName(),
    date: "2024-03-15",
    cityId: 1,
    phone: faker.phone.number(),
    dni: String(faker.random.number(8)),
    username: faker.internet.userName(),
    password: faker.internet.password(6),
    rolId: 1,
    groupId: 1,
    active: true,
    type: "user",
    ...params,
  };
};
const makeFakeClient = (params) => {
  return {
    id: 1,
    name: faker.names.name(),
    address: faker.address.streetName(),
    date: "2024-03-15",
    cityId: 1,
    phone: faker.phone.number(),
    dni: String(faker.random.number(8)),
    username: faker.internet.userName(),
    password: faker.internet.password(6),
    rolId: 1,
    active: true,
    type: "client",
    ...params,
  };
};

const makeFakeOrder = (params) => {
  return {
    clientId: 1,
    products: [
      {
        productId: 1,
        quantity: 2,
        discount: 0,
      },
    ],
    ...params,
  };
};

const makeFakeProduct = (params) => {
  return {
    id: 1,
    name: faker.names.name(),
    description: faker.address.streetName(),
    price: faker.random.number(),
    stock: faker.random.number(),
    image: "",
    active: 1,
    ...params,
  };
};

module.exports = {
  makeFakeCategory,
  makeFakeState,
  makeFakeCity,
  makeFakeRol,
  makeFakeUser,
  makeFakeClient,
  makeFakeGroup,
  makeFakeProduct,
  makeFakeOrder,
};
