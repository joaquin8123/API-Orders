const db = require("../db");

class Audit {
  static async registerAudit({ action, user_id, client_id, details }) {
    try {
      const sql = `
        INSERT INTO audit (action, user_id, client_id, date, details)
        VALUES (?, ?, ?, NOW(), ?)
      `;
      const values = [action, user_id, client_id, JSON.stringify(details)];
      return await db.query(sql, values);
    } catch (error) {
      console.error("Error registering audit:", error);
      throw error;
    }
  }
}

module.exports = Audit;
