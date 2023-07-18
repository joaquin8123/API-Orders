const db = require("../db"); // Import the database instance

class Product {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.active = true;
  }

  static async getProducts() {
    try {
      const sql = "SELECT * FROM orders.product";
      const rows = await db.query(sql);
      const products = parseData(rows);

      return products;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      const sql = `SELECT * FROM orders.product WHERE id= ${productId}`;
      const row = await db.query(sql);
      const product = parseData(row);

      return product;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
}

function parseData(row) {
  return row.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    active: row.active,
    stock: row.stock,
    image: row.image
  }));
}
module.exports = Product;
