const { HTTP_STATUS } = require('../utils/constants');

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    
    ctx.status = err.status || HTTP_STATUS.INTERNAL_SERVER;
    ctx.body = {
      success: false,
      error: err.message || 'Internal server error',
    };
  }
};

module.exports = errorHandler;