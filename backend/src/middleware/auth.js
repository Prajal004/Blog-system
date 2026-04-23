const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const { HTTP_STATUS } = require('../utils/constants');

const authMiddleware = async (ctx, next) => {
  try {
    const token = ctx.headers.authorization?.split(' ')[1];
    
    if (!token) {
      ctx.status = HTTP_STATUS.UNAUTHORIZED;
      ctx.body = { success: false, error: 'Authentication required' };
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user) {
      ctx.status = HTTP_STATUS.UNAUTHORIZED;
      ctx.body = { success: false, error: 'User not found' };
      return;
    }

    ctx.state.user = user;
    await next();
  } catch (error) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED;
    ctx.body = { success: false, error: 'Invalid or expired token' };
  }
};

const adminMiddleware = async (ctx, next) => {
  if (ctx.state.user.role !== 'admin') {
    ctx.status = HTTP_STATUS.FORBIDDEN;
    ctx.body = { success: false, error: 'Admin access required' };
    return;
  }
  await next();
};

module.exports = { authMiddleware, adminMiddleware };