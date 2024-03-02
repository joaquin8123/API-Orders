const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIO = require("socket.io");

const logging = require("./config/logging");
const config = require("./config/config");

/* Routes Import */
const testRoutes = require("./routes/index");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

const NAMESPACE = "Server";
const app = express();

app.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] => URL: [${req.url}] => IP: [${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] => URL: [${req.url}] => IP: [${req.socket.remoteAddress}] => STATUS: [${res.statusCode}]`
    );
  });

  next();
});

/* Parse the request */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Rules of our API */
const corsOptions = {
  origin: "http://localhost:19006",
};
app.use(cors(corsOptions));

/* Routes */
app.use("/", testRoutes);
app.use("/product", productRoutes);
app.use("/auth", authRoutes);
app.use("/order", orderRoutes);

/* Error handling */
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/* Create the server */
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

app.set("socketio", io);
httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `API [Online] => Running on: ${config.server.hostname}:${config.server.port}`
  )
);
