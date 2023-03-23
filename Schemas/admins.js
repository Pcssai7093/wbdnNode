const mongoose = require("mongoose");
const schema = require("mongoose").Schema;
const encryptPassword = module.require("./encrypt");

const adminSchema = new schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      lowercase: true,
      // set: encryptPassword,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const adminConstructor = mongoose.model("admins", adminSchema);
module.exports = adminConstructor;
