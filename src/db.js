const mysql = require("mysql2/promise");
const config = require("./config/config");

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = this;
    }

    return Database.instance;
  }
  async connect() {
    if (!this.connection) {
      try {
        this.connection = await mysql.createConnection({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,
          database:
            process.env.NODE_ENV === "test"
              ? process.env.TEST_DATABASE
              : process.env.DATABASE,
        });

        this.connection.on("error", (err) => {
          console.error(
            "Error en la conexión a la base de datos:",
            err.message
          );
        });
      } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
      }
    }
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
      this.instance.connect();
    }
    return this.instance;
  }

  async query(sql, args) {
    try {
      const [rows] = await this.connection.execute(sql, args);
      return rows;
    } catch (error) {
      console.error("Error en la consulta:", error.message);
      throw error;
    }
  }

  async close() {
    try {
      return await this.connection.end();
    } catch (error) {
      console.error("Error al cerrar la conexión:", error.message);
      throw error;
    }
  }

  async clearDatabase() {
    try {
      const tables = [
        "orderline",
        "orders",
        "client",
        "city",
        "category",
        "state",
        "user",
        "rol",
        "`group`",
        "employee",
        "supplier",
        "order_purchase",
        "product",
        "order_purchase_product",
        "position",
      ];

      for (const table of tables) {
        await this.query(`DELETE FROM ${table}`);
      }
    } catch (error) {
      console.error("Error al limpiar la base de datos:", error.message);
      throw error;
    }
  }
  async insert({ tableName, data }) {
    try {
      const keys = Object.keys(data);

      // Verificar si hay datos para insertar
      if (keys.length === 0) {
        return;
      }

      const values = Object.values(data);

      const placeholders = keys.map(() => "?").join(", ");
      const sql = `INSERT INTO ${tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;
      return await this.query(sql, values);
    } catch (error) {
      console.error("Error al insertar datos:", error.message);
      throw error;
    }
  }

  async getItem({ tableName, keyName, keyValue }) {
    try {
      const sql = `SELECT * FROM ${tableName} WHERE ${keyName}=${keyValue}`;
      const result = await this.query(sql);

      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al buscar datos:", error.message);
      throw error;
    }
  }
}

const dbInstance = Database.getInstance();
module.exports = dbInstance;
