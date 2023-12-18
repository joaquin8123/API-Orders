const db = require("../db");

class User {
  constructor(username, password, name) {
    this.username = username;
    this.password = password;
    this.name = name;
  }

  async register() {
    //sanitizar params
    try {
      const sql = "INSERT INTO orders.user(username, password) VALUES (?, ?)";
      const values = [this.username, this.password];
      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getUser(params) {
    const { username, type } = params;
    const table = type === "user" ? "orders.user" : "orders.client";
    try {
      const sql = `SELECT u.id, username, password, rol.name AS role FROM ${table} u LEFT JOIN orders.rol ON rol.id = u.rol_id WHERE username="${username}"`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = User;
