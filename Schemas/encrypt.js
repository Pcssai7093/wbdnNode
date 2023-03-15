const bcrypt = require("bcrypt");
function encryptPassword(password) {
  return bcrypt.hashSync(password, 2);
}
module.exports = encryptPassword;