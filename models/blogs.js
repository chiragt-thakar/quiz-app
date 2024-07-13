const mongoose = require("mongoose");

const options = {
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
};

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    approvedOn: {
      type: Date,
    },
  },
  options
);

const Model = mongoose.model("Blogs", schema, "Blogs");
module.exports = Model;
