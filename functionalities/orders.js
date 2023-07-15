const db = require("../db/database")

const addNewOrder = ({ customerPhoneNumber, serviceId, customerAddressId, timeSlot }) => {
  const d = new Date();
  const orderId = uniqueId(customerPhoneNumber + d.getTime());
  const otp = generateOTP();
  let query = `insert into orders(orderId,customerPhoneNumber,serviceId,timeSlot,orderStatus,customerAddressId,customerOtp) values('${orderId}','${customerPhoneNumber}','${serviceId}','${timeSlot}','${orderStatus[0]}','${customerAddressId}',${otp});`;
  try {
    db.execute(query, (err, result) => {
      console.log(result);
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { addNewOrder };