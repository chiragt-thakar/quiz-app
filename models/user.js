const md5 = require("md5");
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
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum:["admin","user"]
    },
  },
  options
);

schema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = md5(this.password);
  }
  next();
});
const Model = mongoose.model("Users", schema, "Users");
module.exports = Model;
