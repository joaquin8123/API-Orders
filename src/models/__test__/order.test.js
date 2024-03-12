const { expect } = require("chai");
const { before, after, describe, beforeEach, it } = require("mocha");
const dbInstance = require("../../db");
const { initalConfigs } = require("../../__test__/initalConfig");
const { makeFakeOrder } = require("../../__test__/makeFakeData");
const Order = require("../order");

before(async () => {
  await dbInstance.connect();
});

after(async () => {
  await dbInstance.close();
});

describe("Order Test - Model", () => {
  beforeEach(async () => {
    await dbInstance.clearDatabase();
    await initalConfigs({ orders: true });
  });

  it("Should createOrder successfully", async () => {
    const params = makeFakeOrder({
      clientId: 1,
      products: [{ productId: 1, quantity: 2, discount: 0 }],
      date: "2024-03-12",
      status: "PENDING",
      amount: 1000,
      deliveryTime: 10,
    });
    const orderInstace = new Order(params);
    const { insertId } = await orderInstace.createOrder();
    const order = await dbInstance.getItem({
      tableName: "orders",
      keyName: "id",
      keyValue: insertId,
    });
    expect(order.id).to.equal(insertId);
    expect(order.status).to.equal(params.status);
    expect(order.amount).to.equal(params.amount);
    expect(order.delivery_time).to.equal(params.deliveryTime);
  });

  it("Should FAIL createOrder for params invalid", async () => {
    const params = makeFakeOrder({
      clientId: "fake",
      products: [{ productId: 1, quantity: 2, discount: 0 }],
      date: "2024-03-12",
      status: "PENDING",
      amount: 1000,
      deliveryTime: 10,
    });
    const orderInstace = new Order(params);

    try {
      await orderInstace.createOrder();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
  it("Should getOrders return successfully", async () => {
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

    const orders = await Order.getOrders(0);
    expect(orders.length).to.equal(2);
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
      await Order.getOrders();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("Should getOrderByStatus successfully", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "CONFIRMED" },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order1 },
    });
    await dbInstance.insert({
      tableName: "orderline",
      data: { product_id: 1, discount: 0, quantity: 1, order_id: order2 },
    });

    const orders = await Order.getAllOrdersByStatus("PENDING");
    expect(orders.length).to.equal(1);
  });

  it("Should FAIL getAllOrdersByStatus for params invalid", async () => {
    const { insertId: order1 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "PENDING" },
    });
    const { insertId: order2 } = await dbInstance.insert({
      tableName: "orders",
      data: { client_id: 1, status: "CONFIRMED" },
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
      await Order.getAllOrdersByStatus();
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
});
