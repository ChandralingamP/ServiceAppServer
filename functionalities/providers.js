const db = require('../db/database')
const providerStatus = require("../utils/providers").providerStatus;

const updateAllAvailable = async (spId) => {
    let query = `UPDATE provider SET status = '${providerStatus[0]}' WHERE 1;`;
    db.execute(query, (err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}
const updateAvailable = async (spId) => {
    let query = `UPDATE provider SET status = '${providerStatus[0]}' WHERE providerId = '${spId}';`;
    db.execute(query, (err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}
const updateAssigned = async (spId) => {
    let query = `UPDATE provider SET status = '${providerStatus[1]}' WHERE providerId = '${spId}';`;
    db.execute(query, (err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}

const updateActive = async (spId) => {
    let query = `UPDATE provider SET status = '${providerStatus[2]}' WHERE providerId = '${spId}';`;
    db.execute(query, (err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}

module.exports = { updateActive, updateAssigned ,updateAllAvailable}