const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeProduct } = require("../../__test__/makeFakeData");
const { defaultExpect } = require("../../__test__/defaultExpect");
const {
  createProduct,
  getProducts,
  getProductsApp,
  updateProduct,
  getProductById,
} = require("../product");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Product - Controller", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({});
  });

  it("Should create Product successfully", async () => {
    const params = makeFakeProduct();
    const response = await createProduct({ body: params });
    defaultExpect({
      response,
      code: 201,
      msg: "CREATE_PRODUCT_SUCCESS",
    });
  });

  it("Should return 409 Product already exists", async () => {
    const params = makeFakeProduct();
    dbInstance.insert({ tableName: "product", data: params });
    const response = await createProduct({ body: params });
    defaultExpect({
      response,
      code: 409,
      msg: "CREATE_ALREADY_EXISTS",
      isSuccess: false,
    });
  });

  it("Should getAllProducts successfully", async () => {
    const product1 = makeFakeProduct({ id: 1 });
    const product2 = makeFakeProduct({ id: 2 });
    dbInstance.insert({ tableName: "product", data: product1 });
    dbInstance.insert({ tableName: "product", data: product2 });
    const response = await getProducts();
    defaultExpect({
      response,
      code: 200,
      msg: "GET_PRODUCTS_SUCCESS",
    });
    expect(response.data.products.length).to.equal(2);
  });

  it("Should getAllProductsApp only actives successfully", async () => {
    const product1 = makeFakeProduct({ id: 1 });
    const product2 = makeFakeProduct({ id: 2, active: false });
    dbInstance.insert({ tableName: "product", data: product1 });
    dbInstance.insert({ tableName: "product", data: product2 });
    const response = await getProductsApp();
    defaultExpect({
      response,
      code: 200,
      msg: "GET_PRODUCTS_SUCCESS",
    });
    expect(response.data.products.length).to.equal(1);
  });

  it("Should getProductById successfully", async () => {
    const params = makeFakeProduct();
    dbInstance.insert({ tableName: "product", data: params });
    const response = await getProductById({ params: { productId: params.id } });
    defaultExpect({
      response,
      code: 200,
      msg: "GET_PRODUCT_SUCCESS",
    });
    expect(response.data.product.length).to.equal(1);
  });

  it("Should updateProduct successfully", async () => {
    const params = makeFakeProduct();
    dbInstance.insert({ tableName: "product", data: params });
    const response = await updateProduct({
      body: { productId: params.id, active: false },
    });
    defaultExpect({
      response,
      code: 200,
      msg: "PRODUCT_UPDATE_SUCCESS",
    });

    const prodcutUpdated = await dbInstance.getItem({
      tableName: "product",
      keyName: "id",
      keyValue: params.id,
    });
    expect(prodcutUpdated.active).to.equal(0);
  });
});
