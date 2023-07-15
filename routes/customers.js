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


// CREATE TABLE adminpanel(
//   adminId VARCHAR(70),
//   adminPhoneNumber VARCHAR(10) PRIMARY KEY,
//   adminName VARCHAR(30),
//   adminEmail VARCHAR(100),
//   adminOfficeaddress VARCHAR(500),
//   adminPassword VARCHAR(50)
//   );


router
  .route("/login/:customerPhoneNumber/:customerPassword")
  .get(async (req, res) => {
    const phoneNumber = req.params.customerPhoneNumber;
    const password = req.params.customerPassword;
    //checking isAdmin 
    let query = `SELECT * from adminpanel WHERE adminPhoneNumber = ${phoneNumber} LIMIT 1;`;
    db.execute(query, (err, result) => {
      console.log(result?.length > 0 && result[0].adminPassword == password);
      if (err) {
        res.status(400).json(err);
      } else {
        if (result?.length > 0 && result[0].adminPassword == password) {
          res.json({ admin: true, msg: true, adminDetails: result });
        } else {
          let query = `SELECT * from customer WHERE customerPhoneNumber = ${phoneNumber} LIMIT 1;`;
          db.execute(query, (err, result1) => {
            console.log(result1);
            if (err) {
              res.status(400).json(err);
            } else {
              if (result1?.length > 0 && result1[0].customerPassword == password) {
                res.status(200).json({ admin: false, msg: true, customerDetails: result1[0] });
              } else {
                res.status(200).json({ msg: false });
              }
            }
          });
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

router.route('/edit-profile').put((req, res) => {
  const { name, email, phone, id } = req.body;
  let customerUpdateQuery = `UPDATE customer SET customerName = '${name}', customerEmail  = '${email}', customerPhoneNumber = '${phone}' WHERE customerId  = '${id}';`;
  db.execute(customerUpdateQuery, function (err, result) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  });
});

router.route('/addresses/:phone').get((req, res) => {
  const phone = req.params.phone;
  let query = `SELECT * FROM customerAddress WHERE customerPhoneNumber='${phone}';`;
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  });
});


router.route('/password').put((req, res) => {
  const { customerPassword, customerPhoneNumber } = req.body;
  let query = `UPDATE customer SET customerPassword='${customerPassword}' WHERE customerPhoneNumber = '${customerPhoneNumber}';`;
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json({ msg: true });
    }
  })
});


router.route("/details").get((req, res) => {
  db.execute(`select * from customer;`, (err, result) => {
    res.json(result);
  });
});



module.exports = router;
