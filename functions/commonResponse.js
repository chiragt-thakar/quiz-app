const response = function (success, message, status, data) {
  return {
    success: success,
    message: message,
    statusCode: status,
    data: data,
  };
};
module.exports = {
  response,
};
