require("dotenv").config();
const express = require("express");
const db = require("./db/database");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const customers = require("./router/customers");
app.use("/customer", customers);

const services = require("./router/services");
app.use("/services", services);

const orders = require("./router/orders");
app.use("/orders", orders);
const cart = require("./router/cart");
app.use("/cart", cart);

app.get("/", (req, res) => {
  res.json("Hello My Friend");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at :${PORT}`);
  }
});
