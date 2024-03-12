const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeOrder } = require("../../__test__/makeFakeData");
const { defaultExpect } = require("../../__test__/defaultExpect");
const Fakerator = require("fakerator");
const {
  createOrder,
  getAllOrders,
  getOrders,
  getOrdersByClient,
  getOderById,
  updateOrder,
} = require("../orders");

const faker = Fakerator("es-ES");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Orders - Controller", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({ orders: true });
  });

  it("Should create Order successfully", async () => {
    const params = makeFakeOrder({
      clientId: 1,
      products: [{ productId: 1, quantity: 2, discount: 0 }],
    });
    const response = await createOrder({ body: params });
    defaultExpect({
      response,
      code: 201,
      msg: "ORDER_SUCCESS",
    });
  });

  it("Should FAIL createOrder for params invalid", async () => {
    const params = makeFakeOrder({
      clientId: "fake",
      products: [{ productId: 1, quantity: 2, discount: 0 }],
    });

    try {
      await createOrder({ body: params });
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getOrders successfully", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order1 },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order2 },
    });

    const response = await getOrders({ params: { offset: 0 } });
    defaultExpect({
      response,
      code: 200,
      msg: "GET_ORDERS",
    });
    expect(response.data.orders.length).to.equal(2);
  });

  it("Should FAIL getOrders for params invalid", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order1 },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order2 },
    });

    try {
      await getOrders({});
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getAllOrders successfully", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "CONFIRMED" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order1 },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order2 },
    });

    const response = await getAllOrders({ params: { status: "PENDING" } });
    defaultExpect({
      response,
      code: 200,
      msg: "GET_ALL_ORDERS",
    });
    expect(response.data.orders.length).to.equal(1);
  });

  it("Should FAIL getAllOrders for params invalid", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "CONFIRMED" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order1 },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order2 },
    });

    try {
      await getAllOrders({});
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getOrdersByClient successfully", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "CONFIRMED" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order1 },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order2 },
    });

    const response = await getOrdersByClient({ params: { clientId: 1 } });
    defaultExpect({
      response,
      code: 200,
      msg: "GET_ORDERS_SUCCESS",
    });
    expect(response.data.orders.length).to.equal(2);
  });

  it("Should FAIL getOrdersByClient for params invalid", async () => {
    try {
      await getOrdersByClient({});
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
  it("Should getOderById successfully", async () => {
    const { insertId } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "CONFIRMED" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: insertId },
    });

    const response = await getOderById({ params: { orderId: insertId } });
    defaultExpect({
      response,
      code: 200,
      msg: "GET_ORDER_SUCCESS",
    });
    expect(response.data.order.length).to.equal(1);
  });

  it("Should FAIL getOderById for params invalid", async () => {
    try {
      await getOderById({});
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should updateOrder successfully", async () => {
    const { insertId } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: insertId },
    });

    const response = await updateOrder({
      body: { orderId: insertId, status: "CONFIRMED" },
    });
    defaultExpect({
      response,
      code: 200,
      msg: "ORDER_UPDATE_SUCCESS",
    });

    const orderUpdated = await dbInstance.getItem({
      tableName: "orders",
      keyName: "id",
      keyValue: insertId,
    });
    expect(orderUpdated.status).to.equal("CONFIRMED");
  });

  it("Should FAIL updateOrder for params invalid", async () => {
    try {
      await updateOrder({
        body: { status: "CONFIRMED" },
      });
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
});
