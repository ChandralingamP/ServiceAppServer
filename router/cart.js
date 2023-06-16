// CREATE TABLE cart(
//     cartId VARCHAR(64),
//     customerPhoneNumber VARCHAR(10),
//     serviceId VARCHAR(64),
//     initialPayStatus Boolean
//     );

const router = require("express").Router();
const db = require("../db/database");
const uniqueId = require("../functionalities/UniqueId");

router.route("/").get((req, res) => {
  db.execute("SELECT * FROM cart;", (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

router.route("/get/:customerPhoneNumber").get((req, res) => {
  const { customerPhoneNumber } = req.params;
  let query = `SELECT c.cartId, c.customerPhoneNumber, s.serviceId, s.serviceType, s.serviceCategory, s.serviceDescription, s.servicePrice, s.servicePricediscount, s.serviceRating, s.serviceImagefile FROM cart AS c JOIN services AS s ON c.serviceId = s.serviceId WHERE c.customerPhoneNumber = '${customerPhoneNumber}';`;
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  });
});

router.route("/add").post(async (req, res) => {
  const { customerPhoneNumber, serviceId } = req.body;
  const id = uniqueId(customerPhoneNumber + serviceId);
  console.log("uid"+id);
  let query = `INSERT INTO cart(cartId,customerPhoneNumber, serviceId, initialPayStatus) VALUES ('${id}','${customerPhoneNumber}','${serviceId}',0);`;
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json({ status: false });
    } else {
      res.status(200).json({ status: true });
    }
  });
});

router.route("/update").put((req, res) => {
  const { cartId } = req.body;
  let query = `UPDATE cart SET initialPayStatus = 1 WHERE cartId='${cartId}';`;
  try {
    const result = db.execute(query);
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(400).json({ status: false });
  }
});

router.route("/remove/:cartId").delete((req, res) => {
  const cartId = req.params.cartId;
  let query = `DELETE FROM cart WHERE cartId = '${cartId}';`;
  try {
    const result = db.execute(query);
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(400).json({ status: false });
  }
});

module.exports = router;
