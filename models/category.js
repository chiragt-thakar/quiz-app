const mongoose = require("mongoose");

const options = {
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
};

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        required: true,
    },
  },
  options
);

const Model = mongoose.model("Categories", schema, "Categories");
module.exports = Model;
