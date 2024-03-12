const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeProduct } = require("../../__test__/makeFakeData");
const Product = require("../product");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Product Test - Model", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({});
  });

  it("Should createProduct successfully", async () => {
    const { name, description, price, stock, image, active } =
      makeFakeProduct();

    const productInstace = new Product({
      name,
      description,
      price,
      stock,
      image,
      active,
    });

    const { insertId } = await productInstace.createProduct();
    const product = await dbInstance.getItem({
      tableName: "product",
      keyName: "id",
      keyValue: insertId,
    });

    expect(product.id).to.equal(insertId);
    expect(product.name).to.equal(name);
    expect(product.description).to.equal(description);
    expect(product.price).to.equal(price);
    expect(product.stock).to.equal(stock);
  });

  it("Should FAIL createProduct for params invalid", async () => {
    const { name, description, price, stock, image, active } =
      makeFakeProduct();

    const productInstace = new Product({
      name,
      description,
      price,
      stock: "fake",
      image,
      active,
    });

    try {
      await productInstace.createProduct();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getProductById return successfully", async () => {
    const params = makeFakeProduct();
    await dbInstance.insert({
      tableName: "product",
      data: params,
    });

    const product = await Product.getProductById(params.id);
    expect(product[0].name).to.equal(params.name);
    expect(product[0].description).to.equal(params.description);
    expect(product[0].price).to.equal(params.price);
    expect(product[0].stock).to.equal(params.stock);
  });

  it("Should FAIL getProductById for params invalid", async () => {
    const params = makeFakeProduct();
    await dbInstance.insert({
      tableName: "product",
      data: params,
    });

    try {
      await Product.getProductById();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should updateProduct return successfully", async () => {
    const params = makeFakeProduct();
    await dbInstance.insert({
      tableName: "product",
      data: params,
    });
    await Product.updateProductStatus({
      productId: params.id,
      active: false,
    });
    const product = await dbInstance.getItem({
      tableName: "product",
      keyName: "id",
      keyValue: params.id,
    });
    expect(product.name).to.equal(params.name);
    expect(product.description).to.equal(params.description);
    expect(product.active).to.equal(0);
  });

  it("Should FAIL updateProductStatus for params invalid", async () => {
    const params = makeFakeProduct();
    await dbInstance.insert({
      tableName: "product",
      data: params,
    });

    try {
      await Product.updateProductStatus({
        active: false,
      });
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getProductByName return successfully", async () => {
    const params = makeFakeProduct();
    await dbInstance.insert({
      tableName: "product",
      data: params,
    });
    const product = await Product.getProductByName(params.name);
    expect(product[0].name).to.equal(params.name);
    expect(product[0].description).to.equal(params.description);
    expect(product[0].active).to.equal("activo");
  });

  it("Should FAIL getProductByName for params invalid", async () => {
    const params = makeFakeProduct();
    await dbInstance.insert({
      tableName: "product",
      data: params,
    });

    try {
      await Product.getProductByName();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getProducts return successfully", async () => {
    const product1 = makeFakeProduct({ id: 1 });
    const product2 = makeFakeProduct({ id: 2 });
    await dbInstance.insert({
      tableName: "product",
      data: product1,
    });
    await dbInstance.insert({
      tableName: "product",
      data: product2,
    });
    const products = await Product.getProducts();
    expect(products.length).to.equal(2);
  });

  it("Should getProductsApp only actives return successfully", async () => {
    const product1 = makeFakeProduct({ id: 1 });
    const product2 = makeFakeProduct({ id: 2, active: 0 });
    await dbInstance.insert({
      tableName: "product",
      data: product1,
    });
    await dbInstance.insert({
      tableName: "product",
      data: product2,
    });
    const products = await Product.getProductsApp();
    expect(products.length).to.equal(1);
  });
});
