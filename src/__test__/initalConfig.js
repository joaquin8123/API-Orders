const {
  makeFakeCategory,
  makeFakeState,
  makeFakeCity,
  makeFakeRol,
  makeFakeGroup,
  makeFakeProduct,
  makeFakeClient,
} = require("./makeFakeData");
const dbInstance = require("../db");
const { makeFakeClientDb } = require("./makeFakeDataDb");

const initalConfigs = async ({ orders = false }) => {
  const category = makeFakeCategory();
  const state = makeFakeState();
  const city = makeFakeCity({ state_id: state.id });
  const rol = makeFakeRol();
  const group = makeFakeGroup();

  await dbInstance.insert({ tableName: "category", data: category });
  await dbInstance.insert({ tableName: "state", data: state });
  await dbInstance.insert({ tableName: "city", data: city });
  await dbInstance.insert({ tableName: "rol", data: rol });
  await dbInstance.insert({ tableName: "`group`", data: group });
  if (orders) {
    const product = makeFakeProduct({ stock: 15 });
    const client = makeFakeClientDb({ city_id: city.id, rol_id: rol.id });
    await dbInstance.insert({ tableName: "client", data: client });
    await dbInstance.insert({ tableName: "product", data: product });
  }
};

module.exports = { initalConfigs };
