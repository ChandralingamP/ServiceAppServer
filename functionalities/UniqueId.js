var SHA256 = require("crypto-js/sha256");

function uniqueId(data) {
  // console.log(AES(data));
  return SHA256(data).toString();
}
module.exports = uniqueId;
