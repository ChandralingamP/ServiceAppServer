// CREATE TABLE adminpanel(
//   adminId VARCHAR(70),
//   adminPhoneNumber VARCHAR(10) PRIMARY KEY,
//   adminName VARCHAR(30),
//   adminEmail VARCHAR(100),
//   adminOfficeaddress VARCHAR(500),
//   adminPassword VARCHAR(50)
//   );

const router = require("express").Router();
const db = require("../db/database");
const uniqueId = require("../functionalities/UniqueId");

router.route('/register').post(async (req, res) => {
    const data = req.body;
    let id = uniqueId(data.adminPhoneNumber);
    let query = `INSERT INTO adminpanel(adminId,adminPhoneNumber,adminPassword) VALUES ('${id}','${data.adminPhoneNumber}','${data.adminPassword}')`;
    db.execute(query, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
});

router.route('/password').put((req, res) => {
    const { adminPassword, adminPhoneNumber } = req.body;
    let query = `UPDATE adminpanel SET adminPassword='${adminPassword}' WHERE adminPhoneNumber = '${adminPhoneNumber}';`;
    db.execute(query, (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json({ msg: true });
        }
    })
})

router.route("/").get((req, res) => {
    db.execute(`select * from adminpanel;`, (err, result) => {
        res.json(result);
    });
});

module.exports = router;
