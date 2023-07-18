const db = require("../db"); // Import the database instance

class Order {
  constructor(date, amount) {
    this.date = date;
    this.amount = amount;
  }

  static async getOrders() {
    try {
      const sql = `SELECT
                      o.id AS order_id,
                      o.date,
                      o.user_id,
                      o.amount,
                      o.status,
                      o.delivery_time,
                      JSON_ARRAYAGG(JSON_OBJECT('id', p.id,'name', p.name, 'quantity', ol.quantity)) AS products
                  FROM
                      orders.order AS o
                  JOIN
                      orderline AS ol ON o.id = ol.order_id
                  JOIN
                      product AS p ON ol.product_id = p.id
                  GROUP BY
                      o.id`;
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
}

function parseData(row) {
  return row.map((row) => ({
    id: row.id,
    date: row.date,
    amount: row.amount,
    userId: row.user_id,
    status: row.status,
    deliveryTime: row.delivery_time,
    products: row.products,
  }));
}
module.exports = Order;
