const router = require("express").Router();
const db = require("../db/database");
const generateOTP = require("../functionalities/GenerateOtp");

router.route("/").get((req, res) => {
    res.json("Hello My Friend");
});

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
                    let query = `SELECT * from (SELECT * FROM customer as cus WHERE cus.customerPhoneNumber = ${phoneNumber}) as c LEFT JOIN customerAddress ca ON c.customerAddressId = ca.customerAddressId;`;
                    db.execute(query, (err, result1) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            if (result1?.length > 0 && result1[0].customerPassword == password) {
                                res.status(200).json({ admin: false, msg: true, customerDetails: result1[0] });
                                // let get_address_query = `SELECT * FROM customerAddress WHERE customerAddressId = ${result1[0].customerAddressId}`;
                                // db.execute(get_address_query,(err,result2)=>{
                                //     if(err){
                                //         res.status(200).json({ admin: false, msg: true, customerDetails: result1[0] });
                                //         // res.status(200).json({ admin: false, msg: true, customerDetails: result1[0] });
                                //     }else{
                                //         res.status(200).json({ admin: false, msg: true, customerDetails: result2[0] });
                                //     }
                                // })
                            } else {
                                res.status(200).json({ msg: false });
                            }
                        }
                    });
                }
            }
        });
    });

router.route('/otp/:phoneNumber').get((req, res) => {
    const phoneNumber = req.params.customerPhoneNumber;
    //checking isAdmin 
    let query = `SELECT * from adminpanel WHERE adminPhoneNumber = ${phoneNumber} LIMIT 1;`;
    db.execute(query, (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            if (result?.length > 0) {
                let otp = generateOTP();
                res.json({ msg: true, otp: otp, admin: true });
            } else {
                let query = `SELECT customerPassword from customer WHERE customerPhoneNumber = ${phoneNumber} LIMIT 1;`;
                db.execute(query, (err, result1) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        if (result1?.length > 0) {
                            let otp = generateOTP();
                            res.json({ msg: true, otp: otp, admin: false });
                        } else {
                            res.status(200).json({ msg: false });
                        }
                    }
                });
            }
        }
    });
});


module.exports = router;