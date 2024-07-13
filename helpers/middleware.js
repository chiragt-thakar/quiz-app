const path = require("path");
const { validationResult } = require("express-validator");
const fs = require("fs");

const {
  AuthorizationError,
  ResourceNotFoundError,
  ServerError,
  InvalidRequestError,
  validationError,
  AuthenticationError,
} = require("../errors/common");

module.exports.errorHandler = function (err, req, res, next) {
  if (req.file) {
    fs.unlinkSync(path.resolve(__dirname, `../${req.file?.path}`));
  }
  if (Array.isArray(req.files)) {
    req.files.map((file) => {
      fs.unlinkSync(path.resolve(__dirname, `../${file?.path}`));
    });
  } else {
    for (let file in req.files) {
      req.files[file].map((file) => {
        fs.unlinkSync(path.resolve(__dirname, `../${file?.path}`));
      });
    }
  }
  if (
    err instanceof AuthorizationError ||
    err instanceof AuthenticationError ||
    err instanceof ResourceNotFoundError ||
    err instanceof validationError ||
    err instanceof InvalidRequestError
  ) {
    const error = err?.toJSON();
    const renderData = {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      title: error.type,
    };
    return res.status(400).json(renderData);
  } else {
    const error = new ServerError();
    const errorData = error.toJSON();
    const renderData = {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      title: error.type,
    };
    return res.status(400).json(errorData);
  }
};

module.exports.checkAccess = function (access) {
  return function (req, res, next) {
    if (
      req.user?.accesses &&
      (req.user.accesses.some((element) => {
        return access.includes(element);
      }) ||
        req.user.accesses[access] != undefined)
    ) {
      next();
    } else {
      return next(new AuthorizationError());
    }
  };
};
///handle error of express-validation
//it will delete file if which is add by multer if catch validation error
module.exports.validationsErrorHandle = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new InvalidRequestError(errors.errors[0].msg));
  }
  next();
};
