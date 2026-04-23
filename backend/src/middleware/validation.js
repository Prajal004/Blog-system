const validationMiddleware = (validator) => {
  return async (ctx, next) => {
    const body = ctx.request.body;
    const { error, value } = validator(body);
    
    if (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: error.details[0].message,
      };
      return;
    }
    
    ctx.request.body = value;
    await next();
  };
};

module.exports = validationMiddleware;