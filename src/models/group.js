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
      user u
      LEFT JOIN rol ON rol.id = u.rol_id
      LEFT JOIN \`group\` gr ON gr.id = u.group_id
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
      const sql = `SELECT id,name FROM rol`;
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
      FROM \`group\` g
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
      const sql = `SELECT id, name FROM permission;`;
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
      FROM \`group\` g
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
      const sql = `SELECT id, name FROM \`group\` WHERE name="${name}"`;
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
      const sql = `UPDATE  \`group\` SET ${updateSet} WHERE id = ${params.groupId};`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async createGroup() {
    try {
      const sql = "INSERT INTO  \`group\`(name) VALUES (?)";
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
      const sql = `INSERT INTO group_permission(permission_id, group_id) VALUES ${placeholders}`;
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
    \`group\` g
      JOIN user u ON u.group_id = g.id
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

  static async updateGroupPermissions(params) {
    const { groupId, permissionsIds } = params;
    try {
      for (const permissionId of permissionsIds) {
        const existingPermission = await db.query(
          `SELECT * FROM group_permission WHERE group_id = ${groupId} AND permission_id = ${permissionId}`
        );
        if (!existingPermission || existingPermission.length === 0) {
          await db.query(
            "INSERT INTO group_permission(permission_id, group_id) VALUES (?, ?)",
            [permissionId, groupId]
          );
        }
      }
      return "Success";
    } catch (error) {
      console.error("Error updating group permissions:", error);
      throw error;
    }
  }
}

module.exports = Group;
