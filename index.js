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

app.get("/", (req, res) => {
  db.query("SELECT * FROM customer", function (err, result, fields) {
    if (err) res.json(err);
    res.json(result);
  });
});



app.listen(PORT, () => {
  console.log(`Server is running at :${PORT}`);
});

