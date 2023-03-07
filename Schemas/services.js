const mongoose = require("mongoose");

const schema = mongoose.Schema;

const serviceSchema = new schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productImages: {
      type: [String],
    },
    seller: {
      type: schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const serviceConstructor = mongoose.model("services", serviceSchema);

module.exports = serviceConstructor;
