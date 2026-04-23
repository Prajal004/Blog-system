const authService = require('../services/authService');
const { HTTP_STATUS } = require('../utils/constants');

// ✅ FUNCTION way - NO class keyword
async function register(ctx) {
  try {
    const userData = ctx.request.body;
    const result = await authService.register(userData);
    ctx.status = HTTP_STATUS.CREATED;
    ctx.body = { success: true, ...result };
  } catch (error) {
    ctx.status = HTTP_STATUS.BAD_REQUEST;
    ctx.body = { success: false, error: error.message };
  }
}

async function login(ctx) {
  try {
    const { email, password } = ctx.request.body;
    const result = await authService.login(email, password);
    ctx.body = { success: true, ...result };
  } catch (error) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED;
    ctx.body = { success: false, error: error.message };
  }
}

async function getMe(ctx) {
  ctx.body = { 
    success: true, 
    user: {
      id: ctx.state.user.id,
      username: ctx.state.user.username,
      email: ctx.state.user.email,
      role: ctx.state.user.role,
    }
  };
}

// Export as object with functions
module.exports = { register, login, getMe };