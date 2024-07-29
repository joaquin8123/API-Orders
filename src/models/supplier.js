const db = require("../db");
class Supplier {
  constructor({ name, address, date, phone1, categoryId }) {
    this.name = name;
    this.address = address;
    this.date = date;
    this.phone1 = phone1;
    this.category_id = categoryId;
  }

  static async getAll() {
    try {
      const sql = `SELECT
      sup.id,
      sup.name
      FROM
      supplier AS sup;`;

      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
}

module.exports = Supplier;
