require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const customers = require("./routes/customers");
app.use("/customer", customers);

const services = require("./routes/services");
app.use("/services", services);

const admin = require("./routes/admins");
app.use("/admin", admin);

const orders = require('./routes/orders.js').router;
app.use("/orders", orders);

const cart = require("./routes/cart");
app.use("/cart", cart);

const sp = require("./routes/serviceProvider");
app.use("/providers", sp);

const common = require("./routes/common");
app.use("/", common);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at :${PORT}`);
  }
});
