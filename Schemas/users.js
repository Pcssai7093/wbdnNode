const encryptPassword = module.require("./encrypt");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    fullname: {
      type: String,
      required: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      set: encryptPassword,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    adhaar: {
      type: String,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [String],
    },
    profileImage: {
      type: String,
    },
    about: {
      type: String,
    },
    services: {
      type: [schema.Types.ObjectId],
      ref: "services",
    },
    wishlist: {
      type: [schema.Types.ObjectId],
      ref: "services",
    },
    conversations:{
      type:[schema.Types.ObjectId],
      ref:"conversations"
    }
  },
  { timestamps: true }
);

const userConstructor = mongoose.model("users", userSchema);
module.exports = userConstructor;
