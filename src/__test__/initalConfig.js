const {
  makeFakeCategory,
  makeFakeState,
  makeFakeCity,
  makeFakeRol,
} = require("./makeFakeData");
const dbInstance = require("../db");

const initalConfigs = async () => {
  const category = makeFakeCategory();
  const state = makeFakeState();
  const city = makeFakeCity({ state_id: state.id });
  const rol = makeFakeRol();

  await dbInstance.insert({ tableName: "category", data: category });
  await dbInstance.insert({ tableName: "state", data: state });
  await dbInstance.insert({ tableName: "city", data: city });
  await dbInstance.insert({ tableName: "rol", data: rol });
};

module.exports = { initalConfigs };
