const router = require("express").Router();
const db = require("../db/database");

router.route("/details").get(async (req, res) => {
  console.log("hi");
  let getServiceQuery = `SELECT * FROM services ORDER BY serviceType`;
  db.execute(getServiceQuery, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      const AcServices = result.filter((item) => item.serviceType == "AC");
      const ElectricalServices = result.filter(
        (item) => item.serviceType == "Electrical"
      );
      const PlumbingServices = result.filter(
        (item) => item.serviceType == "Plumbing"
      );
      console.log("hi");
      res.status(200).json({
        AcServices: AcServices,
        ElectricalServices: ElectricalServices,
        PlumbingServices: PlumbingServices,
      });
    }
  });
});

router.route("/details/:type").get(async (req, res) => {
  const type = req.params.type;
  let query = `SELECT * FROM services WHERE serviceType = '${type}';`;
  db.execute(query, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  });
});

router.route("/details/service/:serviceId/:customerPhoneNumber").get(async (req, res) => {
  const serviceId = req.params.serviceId;
  const customerPhoneNumber = req.params.customerPhoneNumber;
  let query = `SELECT * FROM  services WHERE serviceId = '${serviceId}';`;
  db.execute(query, (err, result) => {
    if (err) {
      res.json(err);
    } else {
        let a = result[0].serviceType;
        let query1 = `SELECT * FROM  services WHERE serviceType = '${a}' AND serviceId <> '${serviceId}' ;`;
        db.execute(query1, (err, result1) => {
          if (err) {
            res.json(err);
          } else {
            let query = `SELECT COUNT(*) AS status FROM cart WHERE customerPhoneNumber = '${customerPhoneNumber}' AND serviceId = '${serviceId}';`;
            // let query = `SELECT COUNT(*) AS serviceCount FROM cart WHERE customerPhoneNumber = '${customerPhoneNumber}' AND serviceId = '${serviceId}';`;
            db.execute(query, (err, result2) => {
              if (err) {
                return res.json(err);
              } else {
                const status = result2[0].status > 0 ? true : false;
                res.json({
                  status: status,
                  service: result[0],
                  relatedServices: result1,
                });
              }
            });
          }
        });
    }
  });
});

module.exports = router;
