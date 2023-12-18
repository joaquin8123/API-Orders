const mysql = require("mysql2");
const config = require("./config/config");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    });

    this.connection.connect((err) => {
      if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
      } else {
        console.log("Conexión exitosa a la base de datos");
      }
    });

    this.connection.on("error", (err) => {
      console.error("Error en la conexión a la base de datos:", err.message);
    });

    Database.instance = this;
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const dbInstance = new Database();
module.exports = dbInstance;
