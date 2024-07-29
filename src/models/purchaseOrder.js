const db = require("../db");
const { format } = require("date-fns");
class PurchaseOrder {
  constructor({ date, providerName, status, amount, name, products }) {
    this.date = date;
    this.supplier_id = supplierId;
    this.status = status;
    this.amount = amount;
    this.name = name;
    this.products = products;
  }

  static async getPurchaseOrders() {
    try {
      const sql = `SELECT 
      ord.id AS orderPurchaseId,
      ord.date,
      ord.name,
      ord.amount,
      ord.status,
      supp.name AS nameProvider,
      JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'quantity', opl.quantity)) AS products,
      (SELECT count(*) FROM orders.order_purchase) AS totalItems
FROM orders.order_purchase ord
JOIN
    orders.supplier AS supp ON ord.supplier_id = supp.id
JOIN
    orders.order_purchase_product AS opl ON ord.id = opl.order_purchase_id
JOIN
    orders.product AS p ON opl.product_id = p.id
GROUP BY
    ord.id
ORDER BY
    ord.date DESC
  `;

      const orders = await db.query(sql);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getAllPurchaseOrdersByStatus(status) {
    try {
      const sql = `
        SELECT
          ord.id AS purchaseOrderId,
          ord.date,
          cli.name,
          ord.amount,
          ord.status,
          JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'quantity', ol.quantity)) AS products
        FROM
          orders.order_purchase AS ord
        JOIN
          orders.order_purchase_product AS ol ON ord.id = ol.order_purchase_id
        JOIN
          orders.supplier AS cli ON cli.id = ord.supplier_id
        JOIN
          orders.product AS p ON ol.product_id = p.id
        WHERE
          ord.status = ?
        GROUP BY
          ord.id
        ORDER BY
          ord.date DESC;
      `;

      const rows = await db.query(sql, [status]);

      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getPurchaseOrderById(purchaseOrderId) {
    try {
      const sql = `
        SELECT 
          cli.name AS nameProvider,
          ord.date,
          ord.amount,
          ord.status,
          ord.name,
          JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'quantity', opl.quantity)) AS products
        FROM 
          orders.order_purchase ord 
        JOIN 
          orders.supplier cli ON cli.id = ord.supplier_id
        JOIN
          orders.order_purchase_product AS opl ON ord.id = opl.order_purchase_id
        JOIN
          orders.product AS p ON opl.product_id = p.id
        WHERE 
          ord.id = ?
        GROUP BY
          ord.id;
      `;

      const row = await db.query(sql, [purchaseOrderId]);

      return row;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  static async getPurchaseOrderBySupplierId(supplierId) {
    try {
      const sql = `
        SELECT 
          id AS order_id, 
          status, 
          date, 
          amount
        FROM 
          orders.order_purchase 
        WHERE 
          supplier_id = ? 
        ORDER BY 
          date DESC;
      `;

      const rows = await db.query(sql, [supplierId]);

      return rows;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  static async createPurchaseOrder(orderData) {
    const { name, status, nameProvider, date, amount, products } = orderData;

    try {
      const sql = "CALL CreatePurchaseOrder(?, ?, ?, ?, ?, ?)";
      const values = [name, status, nameProvider, date, amount, products];

      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error creating purchase order:", error);
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

  static async updateOrder({ purchaseOrderId, status }) {
    // Sanitizar parámetros
    try {
      // Consulta de actualización
      const sql = `UPDATE order_purchase SET status = ? WHERE id = ?`;
      const values = [status, purchaseOrderId];

      // Ejecutar la consulta
      const rows = await db.query(sql, values);

      return rows;
    } catch (error) {
      console.error("Error updating order status:", error);
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

  static async lastNumeration() {
    try {
      const sql = `SELECT 
      last_num AS lastNumeration
FROM orders.numeration 
  `;

      const lastNumeration = await db.query(sql);
      return lastNumeration[0];
    } catch (error) {
      console.error("Error fetching orders:", error);
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
module.exports = PurchaseOrder;
