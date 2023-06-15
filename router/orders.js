const router = require("express").Router();
const db = require("../db/database");
const generateOTP = require("../functionalities/GenerateOtp");
const uniqueId = require("../functionalities/UniqueId");

// CREATE TABLE orders(
//     orderId VARCHAR(70) PRIMARY KEY,
//     customerPhoneNumber VARCHAR(10),
//     serviceId VARCHAR(70),
//     customerAddressId VARCHAR(70),
//     orderStatus ENUM('orderplaced', 'rejected', 'pending'),
//     serviceproviderId VARCHAR(70),
//     customerOtp INT,
//     serviceSlotTime TINYTEXT,
//     serviceStartTime TIME,
//     serviceEndTime TIME,
//     additionalCharges FLOAT,
//     customerConfirmationAdditionalCharges BOOLEAN,
//     serviceProviderConfirmationAdditionalCharges BOOLEAN,
//     additionalpayStatus ENUM('paid', 'not_paid', 'pending'),
//     refundRequestStatus Boolean,
//     refundPaidStatus Boolean
//     );

// INSERT INTO orders(orderId, customerPhoneNumber, serviceId, customerAddressId, orderStatus, serviceproviderId, customerOtp, serviceSlotTime, serviceStartTime, serviceEndTime, additionalCharges, customerConfirmationAdditionalCharges, serviceProviderConfirmationAdditionalCharges, additionalpayStatus, refundRequestStatus, refundPaidStatus) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]','[value-11]','[value-12]','[value-13]','[value-14]','[value-15]','[value-16]')
// UPDATE orders SET orderId='[value-1]',customerPhoneNumber='[value-2]',serviceId='[value-3]',customerAddressId='[value-4]',orderStatus='[value-5]',serviceproviderId='[value-6]',customerOtp='[value-7]',serviceSlotTime='[value-8]',serviceStartTime='[value-9]',serviceEndTime='[value-10]',additionalCharges='[value-11]',customerConfirmationAdditionalCharges='[value-12]',serviceProviderConfirmationAdditionalCharges='[value-13]',additionalpayStatus='[value-14]',refundRequestStatus='[value-15]',refundPaidStatus='[value-16]' WHERE 1

router.route("/add").post(async (req, res) => {
  const d = new Date();
  const data = req.body;
  const orderId = uniqueId(data.customerPhoneNumber + d.getTime());
  const otp = generateOTP();
  let query = `insert into orders(orderId,customerPhoneNumber,customerAddressId,customerOtp) values('${orderId}','${data.customerPhoneNumber}','${data.customerAddressId}',${otp});`;
  try {
    const result = db.execute(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.route("/update/address").put(async (req, res) => {
  const data = req.body;
  let query = `UPDATE orders SET customerAddressId='${data.customerAddressId}' WHERE orderId='${data.orderId}';`;
  try {
    db.execute(query);
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(400).json(err);
  }
  //   let query = `UPDATE orders SET customerAddressId='[value-4]',orderStatus='[value-5]',serviceproviderId='[value-6]',customerOtp='[value-7]',serviceSlotTime='[value-8]',serviceStartTime='[value-9]',serviceEndTime='[value-10]',additionalCharges='[value-11]',customerConfirmationAdditionalCharges='[value-12]',serviceProviderConfirmationAdditionalCharges='[value-13]',additionalpayStatus='[value-14]',refundRequestStatus='[value-15]',refundPaidStatus='[value-16]' WHERE orderId='[value-1]'`

  // res.json("updated");
});

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
module.exports = router;