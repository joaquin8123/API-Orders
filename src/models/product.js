const db = require("../db");

class Product {
  constructor({ name, description, price, stock, image, active }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.image = image;
    this.active = active;
  }

  static async getProducts() {
    try {
      const sql = "SELECT * FROM product";
      const rows = await db.query(sql);
      const products = parseData(rows);

      return products;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getProductsApp() {
    try {
      const sql = "SELECT * FROM product WHERE active =true";
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
      const sql = `SELECT * FROM product WHERE id= ${productId}`;
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
      const sql = `SELECT * FROM product WHERE name= '${name}'`;
      const row = await db.query(sql);
      const product = parseData(row);
      return product;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
  async createProduct() {
    try {
      const sql =
        "INSERT INTO product(name, description, price, stock, image, active) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        this.name,
        this.description,
        this.price,
        this.stock,
        this.image,
        this.active,
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
      const sql = `UPDATE product SET active = ${active} WHERE id = ${productId};`;
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
    active: row.active === 1 ? "activo" : "inactivo",
    stock: row.stock,
    image: row.image,
    preparationTime: row.preparation_time,
  }));
}
module.exports = Product;
