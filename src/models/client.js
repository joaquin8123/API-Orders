const db = require("../db");

class Client {
  constructor({
    username,
    password,
    name,
    address,
    phone,
    date,
    cityId,
    rolId,
  }) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.address = address;
    this.phone1 = phone;
    this.date = date;
    this.city_id = cityId;
    this.rol_id = rolId;
  }

  async register() {
    //sanitizar params
    try {
      const sql =
        "INSERT INTO client(username, password, name, address, phone1, date, city_id, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        this.username,
        this.password,
        this.name,
        this.address,
        this.phone1,
        this.date,
        this.city_id,
        this.rol_id,
      ];
      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getClient(params) {
    const { clientId } = params;
    try {
      const sql = `SELECT id, name, username, password FROM client WHERE id=${clientId}`;
      const rows = await db.query(sql);
      return rows[0];
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = Client;
