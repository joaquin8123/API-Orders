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
      const sql = `SELECT g.id as id, g.name as name, JSON_ARRAYAGG(p.name) AS permissions
      FROM orders.group g
      JOIN group_permission gp ON g.id = gp.group_id
      JOIN permission p ON gp.permission_id = p.id
      GROUP BY g.id, g.name;`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getAllPermissions() {
    try {
      const sql = `SELECT id, name FROM orders.permission;`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getGroupById(groupId) {
    try {
      const sql = `SELECT g.id, g.name, JSON_ARRAYAGG(p.name) AS permissions
      FROM orders.group g
      JOIN group_permission gp ON g.id = gp.group_id
      JOIN permission p ON gp.permission_id = p.id
      WHERE g.id = ${groupId}
      GROUP BY g.id, g.name;
      `;
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

  async createGroup() {
    try {
      const sql = "INSERT INTO orders.group(name) VALUES (?)";
      const values = [this.name];
      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
  async createGroupPermission(params) {
    const { groupId, permissionsIds } = params;
    try {
      const values = permissionsIds.map((permissionId) => [
        permissionId,
        groupId,
      ]);
      const placeholders = values.map(() => "(?, ?)").join(", ");
      const sql = `INSERT INTO orders.group_permission(permission_id, group_id) VALUES ${placeholders}`;
      const flattenedValues = values.flat();
      const rows = await db.query(sql, flattenedValues);
      return rows;
    } catch (error) {
      console.error("Error creating group permissions:", error);
      throw error;
    }
  }

  static async getPermissionsByUserId(userId) {
    try {
      const sql = `SELECT 
      g.id,
        g.name,
        JSON_ARRAYAGG(p.name) AS permissions
    FROM 
      orders.group g
      JOIN orders.user u ON u.group_id = g.id
      JOIN group_permission gp ON g.id = gp.group_id
      JOIN permission p ON gp.permission_id = p.id
      WHERE u.id = ${userId}
      GROUP BY g.id, g.name;`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = Group;
