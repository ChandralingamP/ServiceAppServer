const router = require("express").Router();
const db = require("../db/database");
const {updateAssigned,updateAllAvailable} = require("../functionalities/providers");
const orderStatus = require("../utils/orders").orderStatus;
// CREATE TABLE orders(
//     orderId VARCHAR(70) PRIMARY KEY,
//     customerPhoneNumber VARCHAR(10),
//     serviceId VARCHAR(70),
//     customerAddressId VARCHAR(70),
//     orderStatus ENUM('orderplaced', 'rejected', 'pending'),
//     providerId VARCHAR(70),
//     customerOtp INT,
//     serviceSlotTime TINYTEXT,
//     serviceStartTime TIME,
//     serviceEndTime TIME,
//     additionalCharges FLOAT,
//     customerConfirmationAdditionalCharges BOOLEAN,
//     providerConfirmationAdditionalCharges BOOLEAN,
//     additionalpayStatus ENUM('paid', 'not_paid', 'pending'),
//     refundRequestStatus Boolean,
//     refundPaidStatus Boolean
//     );

// INSERT INTO orders(orderId, customerPhoneNumber, serviceId, customerAddressId, orderStatus, providerId, customerOtp, serviceSlotTime, serviceStartTime, serviceEndTime, additionalCharges, customerConfirmationAdditionalCharges, providerConfirmationAdditionalCharges, additionalpayStatus, refundRequestStatus, refundPaidStatus) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]','[value-11]','[value-12]','[value-13]','[value-14]','[value-15]','[value-16]')
// UPDATE orders SET orderId='[value-1]',customerPhoneNumber='[value-2]',serviceId='[value-3]',customerAddressId='[value-4]',orderStatus='[value-5]',providerId='[value-6]',customerOtp='[value-7]',serviceSlotTime='[value-8]',serviceStartTime='[value-9]',serviceEndTime='[value-10]',additionalCharges='[value-11]',customerConfirmationAdditionalCharges='[value-12]',providerConfirmationAdditionalCharges='[value-13]',additionalpayStatus='[value-14]',refundRequestStatus='[value-15]',refundPaidStatus='[value-16]' WHERE 1

router.route("/").get((req, res) => {
  let query = `SELECT * FROM orders;`
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  })
});

router.route("/new").get((req, res) => {
  let query = `SELECT * FROM orders as o LEFT JOIN services as s ON o.serviceId = s.serviceId WHERE o.orderStatus='${orderStatus[0]}' or providerId IS null;`
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  })
});

router.route("/pending").get((req, res) => {
  let query = `SELECT * FROM orders as o LEFT JOIN services as s ON o.serviceId = s.serviceId WHERE o.orderStatus='${orderStatus[1]}' or providerId IS null;`
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  })
});

router.route("/completed").get((req, res) => {
  let query = `SELECT * FROM orders as o LEFT JOIN services as s ON o.serviceId = s.serviceId WHERE o.orderStatus='${orderStatus[2]}' or providerId IS null;`
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  })
})

router.route("/update/address").put(async (req, res) => {
  const data = req.body;
  let query = `UPDATE orders SET customerAddressId='${data.customerAddressId}' WHERE orderId='${data.orderId}';`;
  try {
    db.execute(query);
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.route("/update/provider-id/").put(async (req, res) => {
  const { orderId, providerId } = req.body;
  let query = `UPDATE orders SET providerId = '${providerId}', orderStatus='assigned' WHERE orderId = '${orderId}';`;
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json(false);
    } else {
      const d = updateAssigned(providerId);
      if (d) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    }
  })
})
router.route("/update/provider-id/").get(async (req, res) => {
  let query = `UPDATE orders SET providerId = '', orderStatus='${orderStatus[0]}' WHERE 1;`;
  updateAllAvailable();
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json(false);
    } else {
        res.status(200).json(result);
      
    }
  })
})

router.route("/customer/:customerPhoneNumber").get(async (req, res) => {
  const customerPhoneNumber = req.params.customerPhoneNumber;
  let query = `select * from orders where customerPhoneNumber = ${customerPhoneNumber};`;
  try {
    const data = db.execute(query);
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = {
  router,
  
};