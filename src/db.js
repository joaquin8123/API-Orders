const mysql = require("mysql");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "011096",
      database: "orders",
    });

    Database.instance = this;
    return this;
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

const dbInstance = new Database(); // Create a single instance of Database

module.exports = dbInstance; // Export the single instance
