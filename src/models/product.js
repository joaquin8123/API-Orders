const db = require("../db");

class Product {
  constructor(name, description, price, stock, image) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.image = image;
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
  static async getProductByName(name) {
    try {
      const sql = `SELECT * FROM orders.product WHERE name= '${name}'`;
      const row = await db.query(sql);
      const product = parseData(row);
      return product;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  static async validStock(products) {
    try {
      const sql = `SELECT checkStockAvailability('${JSON.stringify(
        products
      )}') AS result;`;
      const response = await db.query(sql);
      return response[0].result;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
  async createProduct() {
    try {
      const sql =
        "INSERT INTO orders.product(name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)";
      const values = [
        this.name,
        this.description,
        this.price,
        this.stock,
        this.image,
      ];
      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
  static async updateProductStatus({ productId, active }) {
    //sanitizar paramss
    try {
      const sql = `UPDATE orders.product SET active = ${active} WHERE id = ${productId};`;
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
    productId: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    active: row.active === 1 ? 'activo' : 'inactivo',
    stock: row.stock,
    image: row.image,
    preparationTime: row.preparation_time
  }));
}
module.exports = Product;
