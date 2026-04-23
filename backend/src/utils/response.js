const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

const errorResponse = (message, statusCode = 400) => {
  return {
    success: false,
    error: message,
    statusCode,
  };
};

module.exports = { successResponse, errorResponse };