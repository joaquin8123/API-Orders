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

        console.log(
          "Conexión exitosa a la base de datos:",
          this.connection.config.database
        );

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
      await this.connection.end();
      console.log("Conexión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar la conexión:", error.message);
      throw error;
    }
  }

  async clearDatabase() {
    try {
      const tables = [
        "client",
        "city",
        "category",
        "state",
        "rol",
        "employee",
        "supplier",
        "order_purchase",
        "product",
        "order_purchase_product",
        "orderline",
        "position",
        "user",
        "`order`",
      ];

      for (const table of tables) {
        await this.query(`DELETE FROM ${table}`);
      }

      console.log("Base de datos limpia correctamente.");
    } catch (error) {
      console.error("Error al limpiar la base de datos:", error.message);
      throw error;
    }
  }
  async insert({ tableName, data }) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const placeholders = values.map(() => "?").join(", ");
      const sql = `INSERT INTO ${tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;

      await this.query(sql, values);

      console.log("Datos insertados correctamente.");
    } catch (error) {
      console.error("Error al insertar datos:", error.message);
      throw error;
    }
  }
}

const dbInstance = Database.getInstance();
module.exports = dbInstance;
