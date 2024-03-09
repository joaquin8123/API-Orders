const db = require("../db");

class Group {
  constructor(name, active) {
    this.name = name;
    this.active = active;
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

  static async getAllRols() {
    try {
      const sql = `SELECT id,name FROM orders.rol`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
  static async getAllGroups() {
    try {
      const sql = `SELECT id,name FROM orders.group`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getGroupById(groupId) {
    console.log("getGroupById", groupId);
    try {
      const sql = `SELECT id, name FROM orders.group WHERE id=${groupId}`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getGroupByName(name) {
    try {
      const sql = `SELECT id, name FROM orders.group WHERE name="${name}"`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async updateGroup(params) {
    try {
      const updateSet = Object.keys(params)
        .filter((key) => key !== "groupId")
        .map((key) => {
          const value =
            typeof params[key] === "string" ? `"${params[key]}"` : params[key];
          return `${key} = ${value}`;
        })
        .join(", ");
      const sql = `UPDATE orders.group SET ${updateSet} WHERE id = ${params.groupId};`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = Group;
