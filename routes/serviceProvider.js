const router = require("express").Router();
const db = require("../db/database");
const uniqueId = require("../functionalities/UniqueId");
const providerStatus = require("../utils/providers").providerStatus;
// INSERT INTO `provider`(`providerId`, `providerName`, `providerPhoneNumber`, `providerEmail`, `providerAddressId`, `providerAadharNumber`, `providerServiceCount`, `providerRating`, `providerPhotofile`, `providerAadharPhoto`, `providerRole`) VALUES ('d90c0f5c88ceabadf489384d4d1a5ba61e4defb03eb5530714d3ca35ba9dd000','Service Provider 1','1234567812','sp1@gmail.com','','123456789123','0','0','','','Electrical')

router.get('/', (req, res) => {
    let query = `SELECT providerId,providerName,providerPhoneNumber,providerRole,providerRating,providerServiceCount FROM provider;`
    db.execute(query, (err, result) => {
        if (err) {
            res.status(400).json([]);
        } else {
            res.status(200).json({ result });
        }
    })
});

router.get('/available', (req, res) => {
    let query = `SELECT providerId,providerName,providerPhoneNumber,providerRole,providerRating,providerServiceCount FROM provider WHERE status = '${providerStatus[0]}';`
    db.execute(query, (err, result) => {
        if (err) {
            res.status(400).json([]);
        } else {
            res.status(200).json(result);
        }
    })
});

router.get('/assigned', (req, res) => {
    let query = `SELECT providerId,providerName,providerPhoneNumber,providerRole,providerRating,providerServiceCount FROM provider WHERE status = '${providerStatus[1]}';`
    db.execute(query, (err, result) => {
        if (err) {
            res.status(400).json([]);
        } else {
            res.status(200).json(result);
        }
    })
});

router.get('/active', (req, res) => {
    let query = `SELECT providerId,providerName,providerPhoneNumber,providerRole,providerRating,providerServiceCount FROM provider WHERE status = '${providerStatus[2]}';`
    db.execute(query, (err, result) => {
        if (err) {
            res.status(400).json([]);
        } else {
            res.status(200).json(result);
        }
    })
});

router.route("/register").post(async (req, res) => {
    const { providerPhoneNumber } = req.body;
    let id = uniqueId(providerPhoneNumber);
    let query = `INSERT INTO provider(providerId, providerPhoneNumber) VALUES ('${id}',${providerPhoneNumber})`;
    db.execute(query, function (err) {
        if (err) {
            db.execute(
                `SELECT password  FROM provider WHERE providerPhoneNumber = '${providerPhoneNumber}';`,
                function (err, result1) {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        if (result1[0].providerPassword == null) {
                            db.execute(
                                `SELECT providerId FROM provider WHERE providerPhoneNumber = '${providerPhoneNumber}';`,
                                (err, result) => {
                                    if (err) {
                                        res.status(400).json(err);
                                    } else {
                                        let otp = generateOTP();
                                        res.status(200).json({
                                            providerId: result[0].providerId,
                                            providerPhoneNumber: providerPhoneNumber,
                                            otp: otp,
                                            msg: false,
                                        });
                                    }
                                }
                            );
                        } else {
                            res.status(200).json({
                                providerPassword: result1.providerPassword,
                                msg: true,
                            });
                        }
                    }
                }
            );
        } else {
            let otp = generateOTP();
            res.status(200).json({
                providerId: id,
                providerPhoneNumber: providerPhoneNumber,
                otp: otp,
                msg: false,
            });
        }
    });
});

router
    .route("/login/:providerPhoneNumber/:providerPassword")
    .get(async (req, res) => {
        const phoneNumber = req.params.providerPhoneNumber;
        const password = req.params.providerPassword;
        let query = `SELECT * from provider WHERE providerPhoneNumber = ${phoneNumber} LIMIT 1;`;
        db.execute(query, (err, result) => {
            console.log(result);
            if (err) {
                res.status(400).json(err);
            } else {
                if (result?.length > 0 && result[0].providerPassword == password) {
                    res.status(200).json({ msg: true, providerDetails: result[0] });
                } else {
                    res.status(200).json({ msg: false });
                }
            }
        });
});

router.route("/update/details").put((req, res) => {
    const { providerId, providerPhoneNumber, providerName, providerAddressLine1, providerAddressLine2, providerLandmark, providerCity, providerPincode, providerEmail, providerAadharNumber, providerPhotofile, providerAadharPhoto, providerPassword } = req.body;
    let providerAddressId = uniqueId(providerPhoneNumber + providerName + providerAddressLine1 + providerAddressLine2 + providerLandmark + providerCity + providerPincode);
    let addressUpdateQuery = `INSERT INTO provideraddress (providerAddressId,providerPhoneNumber, providerAddressLine1, providerAddressLine2, providerLandmark, providerCity,providerPincode) VALUES (?,?,?,?,?,?,?);`;
    try {
        db.execute(addressUpdateQuery, [providerAddressId, providerPhoneNumber, providerAddressLine1, providerAddressLine2, providerLandmark, providerCity, providerPincode], (err) => {
            if (err) {
                res.status(400).json(false);
            } else {
                let query = `UPDATE provider SET providerName = ?, providerEmail = ?, providerAddressId = ?,providerAadharNumber = ?,providerPhotofile = '', providerAadharPhoto = '' providerPassword =? WHERE providerId = ?;`;
                db.execute(query, [providerName, providerEmail, providerAddressId, providerAadharNumber, providerPassword, providerId], function (err, result) {
                    if (err) {
                        res.status(400).json(false);
                    } else {
                        res.status(200).json(true);
                    }
                });
            }
        });
    } catch (err) {
        res.status(400).json(false);
    }
});


module.exports = router;