const express = require("express");
const errorMiddleware = require("./middlewares/errors");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");

//import all routes

const products = require("./routes/product");
const user = require("./routes/user");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("api/v1",order)
app.use(cookieParser);

//handling error
app.use(errorMiddleware);

module.exports = app;
