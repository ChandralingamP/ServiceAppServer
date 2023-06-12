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
      res
        .status(200)
        .json({
          AcServices: AcServices,
          ElectricalServices: ElectricalServices,
          PlumbingServices: PlumbingServices,
        });
    }
  });
});

module.exports = router;
