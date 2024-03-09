const db = require("../db");

class User {
  constructor(username, password, rolId, groupId, active) {
    this.username = username;
    this.password = password;
    this.rolId = rolId;
    this.groupId = groupId;
    this.active = active;
  }

  async register() {
    //sanitizar params
    try {
      const sql =
        "INSERT INTO orders.user(username, password, rol_id, group_id, active) VALUES (?, ?, ?, ?, ?)";
      const values = [
        this.username,
        this.password,
        this.rolId,
        this.groupId,
        this.active,
      ];
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
      const sql = `SELECT u.id, username, password, rol.name AS role, active FROM ${table} u LEFT JOIN orders.rol ON rol.id = u.rol_id WHERE username="${username}"`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getAllGroupUser() {
    try {
      const sql = `SELECT
      u.id,
      username,
      rol.name AS rol_name,
      active,
      gr.name AS group_name
  FROM
      orders.user u
      LEFT JOIN orders.rol ON rol.id = u.rol_id
      LEFT JOIN orders.group gr ON gr.id = u.group_id
  `;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async updateUser(params) {
    try {
      const updateSet = Object.keys(params)
        .filter((key) => key !== "userId")
        .map((key) => {
          const value =
            typeof params[key] === "string" ? `"${params[key]}"` : params[key];
          return `${key} = ${value}`;
        })
        .join(", ");
      const sql = `UPDATE orders.user SET ${updateSet} WHERE id = ${params.userId};`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const sql = `SELECT
      u.id,
      username,
      rol.name AS rol_name,
      active,
      gr.name AS group_name
  FROM
      orders.user u
      LEFT JOIN orders.rol ON rol.id = u.rol_id
      LEFT JOIN orders.group gr ON gr.id = u.group_id
  WHERE 
      u.id = ${userId}
      `;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = User;
