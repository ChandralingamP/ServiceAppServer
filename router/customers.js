const router = require("express").Router();
const db = require("../db/database");
const uniqueId = require("../functionalities/UniqueId");
const generateOTP = require("../functionalities/GenerateOtp");

router.route("/register").post(async (req, res) => {
  const data = req.body;
  console.log("hi");
  let id = uniqueId(data.customerPhoneNumber);
  let query = `INSERT INTO customer(customerId,customerPhoneNumber) VALUES ('${id}',${data.customerPhoneNumber})`;
  db.execute(query, function (err, result) {
    if (err) {
      db.execute(
        `SELECT customerPassword FROM customer WHERE customerPhoneNumber = '${data.customerPhoneNumber}';`,
        function (err, result1) {
          if (err) {
            res.status(400).json(err);
          } else {
            if (result1[0].customerPassword == null) {
              db.execute(
                `SELECT customerId FROM customer WHERE customerPhoneNumber = '${data.customerPhoneNumber}';`,
                (err, result) => {
                  if (err) {
                    res.status(400).json(err);
                  } else {
                    let otp = generateOTP();
                    res.status(200).json({
                      customerId: result[0].customerId,
                      customerPhoneNumber: data.customerPhoneNumber,
                      otp: otp,
                      msg: false,
                    });
                  }
                }
              );
            } else {
              res.status(200).json({
                customerPassword: result1.customerPassword,
                msg: true,
              });
            }
          }
        }
      );
    } else {
      let otp = generateOTP();
      res.status(200).json({
        customerId: id,
        customerPhoneNumber: data.customerPhoneNumber,
        otp: otp,
        msg: false,
      });
    }
  });
});

router
  .route("/login/:customerPhoneNumber/:customerPassword")
  .get(async (req, res) => {
    const customerPhoneNumber = req.params.customerPhoneNumber;
    const customerPassword = req.params.customerPassword;
    // res.status(200).json({customerPassword:customerPassword,customerPhoneNumber:customerPhoneNumber});
    let query = `SELECT customerPassword from customer WHERE customerPhoneNumber = ${customerPhoneNumber};`;
    db.execute(query, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        if (result[0].customerPassword == customerPassword) {
          res.status(200).json({ msg: true, customerDetails: result });
        } else {
          res.status(200).json({ msg: false });
        }
      }
    });
  });

router.route("/details").put(async (req, res) => {
  const data = req.body;
  let id = uniqueId(
    data.customerPhoneNumber +
      data.customerEmail +
      data.customerCity +
      data.customerAddressLine1 +
      data.customerAddressLine2 +
      data.customerPincode
  );
  let addressUpdateQuery = `INSERT INTO customerAddress (customerAddressId, customerPhoneNumber, customerAddressLine1, customerAddressLine2, customerLandmark, customerCity, customerPincode) VALUES ('${id}', '${data.customerPhoneNumber}', '${data.customerAddressLine1}', '${data.customerAddressLine2}', '${data.customerLandmark}', '${data.customerCity}', ${data.customerPincode});`;
  try {
    db.execute(addressUpdateQuery, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        console.log(id);
        let customerUpdateQuery = `UPDATE customer SET customerPassword = '${data.customerPassword}', customerName = '${data.customerName}', customerEmail  = '${data.customerEmail}', customerAddressId  = '${id}', customerOrderCount  = 0 WHERE customerPhoneNumber = '${data.customerPhoneNumber}';`;
        db.execute(customerUpdateQuery, function (err, result) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json(result);
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.route("/details").get((req, res) => {
  db.execute(`select * from customerAddress;`, (err, result) => {
    res.json(result);
  });
});

module.exports = router;
