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

  static async getOrders(offset) {
    try {
      const sql = `SELECT
      ord.id AS order_id,
      ord.date,
      cli.name,
      ord.amount,
      ord.status,
      ord.delivery_time,
      JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'quantity', ol.quantity)) AS products,
      (SELECT count(*) FROM orders) AS totalItems
    FROM
      orders AS ord
    JOIN
      orderline AS ol ON ord.id = ol.order_id
    JOIN
      client AS cli ON cli.id = ord.client_id
    JOIN
      product AS p ON ol.product_id = p.id
    GROUP BY
      ord.id
    ORDER BY
      ord.date DESC
    LIMIT 10
    OFFSET ${offset};`;

      const rows = await db.query(sql);
      // Transformar los resultados en un formato más limpio
      const orders = parseData(rows);

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getAllOrdersByStatus(status) {
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
    orders AS ord
    JOIN
      orderline AS ol ON ord.id = ol.order_id
    JOIN
      client AS cli ON cli.id = ord.client_id
    JOIN
      product AS p ON ol.product_id = p.id
    WHERE
    ord.status = '${status}'
    GROUP BY
      ord.id
    ORDER BY
      ord.date DESC;`;
      const rows = await db.query(sql);
      // Transformar los resultados en un formato más limpio
      const orders = parseData(rows);

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async monthlyAmount() {
    try {
      const sql = `CALL get_monthly_data();`;
      const rows = await db.query(sql);
      return rows[0];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async salesByMonth() {
    try {
      const sql = `CALL get_sales_count_by_month();`;
      const rows = await db.query(sql);
      return rows[0];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async salesByProduct() {
    try {
      const sql = `CALL get_order_count_per_product();`;
      const rows = await db.query(sql);
      return rows[0];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const sql = `SELECT cli.name AS name,ord.date,ord.amount,ord.status,ord.delivery_time FROM orders ord JOIN client cli ON cli.id = ord.client_id  WHERE ord.id=${orderId}`;
      const row = await db.query(sql);

      // Transformar los resultados en un formato más limpio
      const order = parseData(row);

      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  static async getOrderByClientId(clientId) {
    try {
      const sql = `SELECT id AS order_id, status, date, amount, delivery_time FROM orders WHERE client_id= ${clientId} ORDER BY orders.date DESC`;
      const row = await db.query(sql);

      // Transformar los resultados en un formato más limpio
      const orders = parseData(row);

      return orders;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  async createOrder() {
    //sanitizar params
    try {
      const sql =
        "INSERT INTO orders(date, client_id, status,amount,delivery_time) VALUES (?, ?, ?, ?, ?)";
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
      const sql = `UPDATE orders SET status = '${status}' WHERE id = ${orderId};`;
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
    date: format(new Date(row.date), "dd/MM/yyyy HH:mm:ss"),
    amount: row.amount,
    clientName: row.name,
    status: row.status,
    deliveryTime: row.delivery_time,
    products: row.products,
    totalItems: row.totalItems,
  }));
}
module.exports = Order;
