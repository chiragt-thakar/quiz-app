const { ResourceNotFoundError } = require("../errors/common");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const configuration = require("../config/index");
const { response } = require("../functions/commonResponse");

const loginUser = async (req, res, next) => {
    try {
    //check if user exists
    const userExist = await userModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res.status(400).json(response(false, "user does not exist", 400));
    }
    // check if password is correct
    if (userExist.password !== md5(req.body.password)) {
      return res.status(400).json(response(false, "incorrect password", 400));
    }

    const accessToken = jwt.sign(
      {
        id: userExist._id,
      },
      configuration.jwtSecret.secret,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .json(response(true, "logged in", 200, accessToken));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  loginUser,
};
