const db = require("../db");
const { format } = require("date-fns");
class Order {
  constructor({
    date,
    clientId,
    status,
    amount,
    orderId,
    products,
    deliveryTime,
  }) {
    this.date = date;
    this.client_id = clientId;
    this.status = status;
    this.amount = amount;
    this.order_id = orderId;
    this.products = products;
    this.delivery_time = deliveryTime;
  }

  static async getOrders() {
    try {
      const sql = `SELECT
      ord.id AS order_id,
      ord.date,
      cli.name,
      ord.amount,
      ord.status,
      ord.delivery_time,
      JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'quantity', ol.quantity)) AS products
    FROM
      orders.order AS ord
    JOIN
      orderline AS ol ON ord.id = ol.order_id
    JOIN
      client AS cli ON cli.id = ord.client_id
    JOIN
      product AS p ON ol.product_id = p.id
    GROUP BY
      ord.id
    ORDER BY
      CASE ord.status
        WHEN 'PENDING' THEN 1
        WHEN 'PROCESSING' THEN 2
        WHEN 'CONFIRMED' THEN 3
        WHEN 'CANCELLED' THEN 4
        ELSE 5 
      END;`;
      const rows = await db.query(sql);
      // Transformar los resultados en un formato más limpio
      const orders = parseData(rows);

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const sql = `SELECT * FROM orders.order WHERE id= ${orderId}`;
      const row = await db.query(sql);

      // Transformar los resultados en un formato más limpio
      const order = parseData(row);

      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  async createOrder() {
    //sanitizar params
    try {
      const sql =
        "INSERT INTO orders.order(date, client_id, status,amount,delivery_time) VALUES (?, ?, ?, ?, ?)";
      const values = [
        this.date,
        this.client_id,
        this.status,
        this.amount,
        this.delivery_time,
      ];
      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async createOrderLine({ orderId, products }) {
    //sanitizar params
    try {
      for (const line of products) {
        const { productId, quantity, discount } = line;
        const sql = `CALL InsertOrderLineAndUpdateProduct(${productId}, ${discount}, ${quantity}, ${orderId});`;
        const rows = await db.query(sql);
        return rows;
      }
    } catch (error) {
      console.error("Error create orders:", error);
      throw error;
    }
  }

  static async updateOrder({ orderId }) {
    //sanitizar paramss
    try {
      for (const line of this.products) {
        const { productId, cant, discount } = line;
        const sql = `CALL InsertOrderLineAndUpdateProduct(${productId}, ${discount}, ${cant}, ${orderId});`;
        const rows = await db.query(sql);
        return rows;
      }
    } catch (error) {
      console.error("Error create orders:", error);
      throw error;
    }
  }

  static async updateOrderStatus({ orderId, status }) {
    //sanitizar paramss
    try {
      const sql = `UPDATE orders.order SET status = '${status}' WHERE id = ${orderId};`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error create orders:", error);
      throw error;
    }
  }
}

function parseData(row) {
  return row.map((row) => ({
    orderId: row.order_id,
    date: format(new Date(row.date), "dd/MM/yyyy"),
    amount: row.amount,
    clientName: row.name,
    status: row.status,
    deliveryTime: row.delivery_time,
    products: row.products,
  }));
}
module.exports = Order;
